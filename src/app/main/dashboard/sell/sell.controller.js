(function () {
	'use strict';

	angular
		.module('app.sell')
		.controller('SellController', SellController);

	/** @ngInject */
	function SellController($scope, $timeout, msNavigationService, $mdToast, $mdDialog, $auth, CONFIG, api, MisapayHub, webNotification, SoundService, localStorageService) {
		var vm = this;

		vm.isToggleCategory = false;
		vm.discount = 0;

		vm.toggleCategoryMenu = function () {
			vm.isToggleCategory = !vm.isToggleCategory;
		};

		vm.getImage = function (item) {
			return CONFIG.HOST_URL + '/' + item.Image;
			//return "http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image";
		};

		vm.resetFilter = function () {
			vm.searchText = '';
			delete vm.currentCategory;
			vm.Products = vm.HubData.Products;
		};

		vm.queryTableSearch = function (text) {
			var result = vm.Tables.filter(function (table) {
				return table.Name.toSlug().indexOf(text.toSlug()) > -1;
			});
			return result;
		};

		vm.selectedTableChange = function (table) {
			if (!table) return;

			var found = false;
			for (var i = 0; i < vm.tableTabs.length; i++) {
				if (vm.tableTabs[i].Id === table.Id) {
					found = true;
				} else {
					if (vm.tableTabs[i].TableType !== 0 && vm.tableTabs[i].Orders.length <= 0) {
						vm.tableTabs.splice(i, 1);
					}
				}
			}
			if (!found) {
				vm.tableTabs.push(table);
			}
		}

		vm.selectCategory = function (category) {
			vm.searchText = '';
			vm.currentCategory = category;
			vm.Products = vm.HubData.Products.filter(function (product) {
				return product.ProductCategories.filter(function (pc) {
					return pc.CategoryId === category.Id;
				}).length > 0;
			});
		};

		vm.searchProducts = function () {
			delete vm.currentCategory;
			vm.Products = vm.HubData.Products.filter(function (product) {
				return product.Name.toSlug().indexOf(vm.searchText.toSlug()) > -1
					|| product.Name.toSlug().toAcronym().indexOf(vm.searchText) > -1;
			});
		};

		vm.selectTable = function (table) {
			$timeout(function () {
				vm.currentTable = table;
			}, 10);
		}

		vm.hasOrderTableFilter = function (table) {
			return table.TableType === 0 || table.Orders.length > 0 || table === vm.currentTable;
		};

		vm.keyPressDiscount = function ($event) {
			console.log(vm.discount);
			if (isNaN(String.fromCharCode($event.keyCode)) || vm.discount > 10) {
				$event.preventDefault();
			}
		}

		vm.getTableTotal = function (discount) {
			if (!vm.currentTable) return 0;
			var total = 0;
			for (var i = 0; i < vm.currentTable.Orders.length; i++) {
				total += vm.currentTable.Orders[i].Total;
			}
			return discount && !isNaN(vm.discount) && vm.discount > 0 && vm.discount < 100 ? total * (1 - vm.discount / 100) : total;
		}

		vm.addProduct = function (product) {
			var existingOrder = vm.currentTable.Orders.find(function (order) {
				return order.ProductId === product.Id;
			});
			if (existingOrder !== undefined) {
				var orderToUpdate = angular.copy(existingOrder);
				orderToUpdate.Quantity += 1;
				MisapayHub.UpdateOrderItem(orderToUpdate).done(function (newOrder) {
					if (newOrder.IsCancelled) {
						$mdDialog.show($mdDialog.alert()
							.title("Không thể cập nhật đơn hàng")
							.textContent(newOrder.Message)
							.ok("Đóng")
						);
					} else {
						existingOrder.Quantity = newOrder.Quantity;
						existingOrder.Total = newOrder.Total;
						$scope.$apply();
					}
				});
			} else {
				var order = {
					ProductId: product.Id,
					ProductName: product.Name,
					Quantity: 1,
					Price: product.Price,
					Total: product.Price,
					TableId: vm.currentTable.Id
				};
				MisapayHub.OrderSingle(order).done(function (newOrder) {
					if (newOrder.IsCancelled) {
						$mdDialog.show($mdDialog.alert()
							.title("Không thể thêm mặt hàng")
							.textContent(newOrder.Message)
							.ok("Đóng")
						);
					} else {
						vm.currentTable.Orders.push(newOrder);
						$scope.$apply();
					}
				});
			}
		};

		vm.removeOrderItem = function (orderItem) {
			MisapayHub.RemoveOrderItem(orderItem).done(function (cancelled) {
				vm.currentTable.Orders.splice(vm.currentTable.Orders.indexOf(orderItem), 1);
				$scope.$apply();

				$mdToast.show($mdToast.simple()
					.textContent("Hủy dịch vụ thành công")
					.position('bottom center')
					.hideDelay(3000));
			}).fail(function (err) {
				console.log(err);
			});
		};

		vm.printToBar = function () {
			var confirm = $mdDialog.show({
				controller: 'PrintConfirmController',
				templateUrl: 'app/dialogs/print-confirm/print.confirm.html',
				parent: angular.element(document.body),
				controllerAs: 'vm',
				locals: { Table: vm.currentTable }
			});
			confirm.then(function (allowReceipt) {
				var orderItemIds = [];
				angular.forEach(vm.currentTable.Orders, function (orderItem) {
					orderItemIds.push(orderItem.Id);
				})
				MisapayHub.Checkout(vm.currentTable.Id, allowReceipt, vm.discount)
					.done(function (newTable) {
						vm.currentTable.OrderTotal = newTable.OrderTotal;
						vm.currentTable.Orders = newTable.Orders;
						vm.discount = 0;
						$scope.$apply();
					});
			}, function () {
				console.log('cancelled');
			})
		};

		vm.changeOrderItemQty = function (orderItem, $event) {
			var orderToUpdate = angular.copy(orderItem);
			MisapayHub.UpdateOrderItem(orderToUpdate).done(function (newOrder) {
				orderItem.Quantity = newOrder.Quantity;
				orderItem.Total = newOrder.Total;
				$scope.$apply();
				if (newOrder.IsCancelled) {

					$mdDialog.show($mdDialog.alert()
						.title("Không thể cập nhật đơn hàng")
						.textContent(newOrder.Message)
						.ok("Đóng")
					);
				}
			});
		};

		$scope.$on('OnNewOrder', function ($event, connectionId, newOrder) {
			for (var i = 0; i < vm.Tables.length; i++) {
				if (vm.Tables[i].Id === newOrder.TableId) {
					$timeout(function () {
						vm.Tables[i].Orders.push(newOrder);
						vm.selectedTableChange(vm.Tables[i]);
					}, 10);

					vm.showNotification('Có dịch vụ mới', newOrder.TableName + ' gọi ' + newOrder.Quantity + ' ' + newOrder.ProductName);
					SoundService.getSound('ring').start();
					break;
				}
			}
		});

		vm.showNotification = function (title, content) {
			if (webNotification.lib.permission !== 'granted') {
				webNotification.lib.requestPermission();
			}
			webNotification.showNotification(title, {
				body: content,
				icon: '/assets/images/logo-small.png',
				autoClose: 4000
			}, function onShow(error, hide) {
				if (error) {
					console.log('Unable to show notification: ' + error.message);
				}
			});
		}

		$scope.$on('OnCancelOrder', function ($event, connectionId, cancelledOrder) {
			angular.forEach(vm.Tables, function (table) {
				for (var i = 0; i < table.Orders.length; i++) {
					if (cancelledOrder.Id === table.Orders[i].Id) {
						table.Orders.splice(i, 1);
						$scope.$apply();
						vm.showNotification('Dịch vụ đã hủy', cancelledOrder.TableName + ' đã hủy ' + cancelledOrder.ProductName);
					}
				}
			});
		});

		$scope.$on('OnOrderRemoved', function ($event, removedOrder) {
			angular.forEach(vm.Tables, function (table) {
				for (var i = 0; i < table.Orders.length; i++) {
					if (removedOrder.Id === table.Orders[i].Id) {
						table.Orders.splice(i, 1);
						$scope.$apply();
						vm.showNotification('Dịch vụ đã hủy', 'Dịch vụ ' + removedOrder.ProductName + ' đã bị hủy từ người khác');
					}
				}
			});
		});

		$scope.$on('OnOrderPrinted', function ($event, printedOrderIds) {
			console.log("Đang in...", printedOrderIds);
		});

		$scope.$on('OnOrderCheckout', function ($event, table) {
			for (var i = 0; i < vm.Tables.length; i++) {
				if (vm.Tables[i].Id === table.Id) {
					vm.Tables[i].Orders = [];
					vm.Tables[i].OrderTotal = 0;
					$scope.$apply();
				}
			}
		});

		$scope.$on('OnOrderChanged', function ($event, changedOrder) {
			angular.forEach(vm.Tables, function (table) {
				for (var i = 0; i < table.Orders.length; i++) {
					if (changedOrder.Id === table.Orders[i].Id) {
						table.Orders[i] = changedOrder;
						$scope.$apply();
					}
				}
			});
		});

		$scope.$on('OnNewTable', function ($event, table) {
			vm.Tables.push(table);
			$scope.$apply();
			$mdToast.show($mdToast.simple()
				.textContent("Có client mới kết nối " + table.Name)
				.position('bottom center')
				.hideDelay(3000));
		});

		$scope.$on('OnClientConnected', function ($event, table) {
			$mdToast.show($mdToast.simple()
				.textContent("Máy " + table.Name + " vừa kết nối")
				.position('bottom center')
				.hideDelay(3000));
		});

		$scope.$on('OnClientDisconnected', function ($event, table) {
			$mdToast.show($mdToast.simple()
				.textContent("Máy " + table.Name + " mất kết nối")
				.position('bottom center')
				.hideDelay(3000));
			for (var i = 0; i < vm.Tables.length; i++) {
				if (vm.Tables[i].Id === table.Id) {
					vm.Tables[i].Orders = [];
					vm.Tables[i].OrderTotal = 0;
					$scope.$apply();
				}
			}
		});

		$scope.$on("angular-resizable.resizeEnd", function (event, args) {
			if(args.width) {
				localStorageService.set('salebox.width', args.width);
			}
        });

		vm.isConnected = false;
		$scope.$on('$viewContentLoaded', function () {
			if ($.connection.hub.state !== $.signalR.connectionState.connected) {
				vm.isConnected = false;
				if (!vm.isConnected) {
					MisapayHub.connect({ 'token': $auth.getToken() }).done(function () {
						vm.isConnected = true;
						vm.loadData();
					});
				}
			} else {
				vm.loadData();
			}
			vm.restoreSaleBoxSize();
		});

		vm.restoreSaleBoxSize = function() {
			var app_w = angular.element('#sell-app').width();
			var old_w = localStorageService.get('salebox.width');
			if(old_w + 200 < app_w) {
				angular.element('#sale-sidebar').css('flex-basis', old_w + 'px');
			}
		};

		$scope.$on('$destroy', function () {
			MisapayHub.disconnect();
			vm.isConnected = false;
			if (msNavigationService.getFolded()) {
				msNavigationService.toggleFolded();
			}
		});

		vm.loadData = function () {

			MisapayHub.GetData().then(function (data) {
				vm.HubData = data;
				vm.Products = data.Products;
				vm.Categories = data.Categories;
				vm.Rooms = data.Rooms;
				vm.Tables = data.Tables;
				vm.tableTabs = vm.Tables.filter(function (table) {
					return table.TableType === 0 || table.Orders.length > 0 || table === vm.currentTable;
				});
				vm.currentTable = vm.Tables[0];
				$scope.$apply();
				// Folding navigation menus
				if (!msNavigationService.getFolded()) {
					//msNavigationService.toggleFolded();
				}
			});
		};

		vm.openSettings = function ($event) {
			$mdDialog.show({
				parent: angular.element(document.body),
				targetEvent: $event,
				clickOutsideToClose: true,
				templateUrl: 'app/dialogs/sell-settings/sell.settings.html',
				controller: 'SellSettingsController',
				controllerAs: 'vm',
			});
		};

	}
})();