(function () {
	'use strict';

	angular
		.module('app.product')
		.controller('ProductController', ProductController);

	/** @ngInject */
	function ProductController($scope, $state, $mdDialog, $mdToast, $mdEditDialog, api, CONFIG, PRINTERS, Categories) {
		var vm = this;
		vm.Printers = PRINTERS.items;
		vm.Categories = Categories.items;

		vm.selectedRows = [];
		vm.filter = {
			show: false,
			query: {
				fields: ['name'],
				keyword: '',
				categories: [],
				order: '',
				page: 1,
				limit: 10
			},
			options: {
				debounce: 500
			},
			remove: function () {
				vm.filter.show = false;
				vm.filter.query.keyword = '';
			}
		};

		vm.success = function (data) {
			vm.items = data.items;
			vm.itemsCount = data.total;
		};

		vm.getPromise = function () {
			vm.promise = api.product.get(vm.filter.query, vm.success).$promise;
		};

		$scope.$watchGroup(['vm.filter.query.keyword', 'vm.filter.query.categories'], function (newValue, oldValue) {
			vm.filter.query.page = 1;
			vm.getPromise();
		});

		vm.destroy = function (item) {
			var confirm = $mdDialog.confirm()
				.title('Bạn thực sự muốn xóa?')
				.textContent('Thao tác xóa sẽ không hồi lại được')
				.ariaLabel('Lucky day')
				.ok('Chắc chắn xóa')
				.cancel('Bỏ qua');

			$mdDialog.show(confirm).then(function () {
				api.product.delete({ id: item.id }, item, function () {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Xóa thành công!')
							.position('bottom right')
							.hideDelay(3000)
					);
					vm.getPromise();
				});
			});
		};

		vm.getImage = function (image) {
			return CONFIG.HOST_URL + '/' + image;
		};

		vm.formatCategory = function (product) {
			var categories = vm.Categories.filter(function (category) {
				return product.productCategories.some(function (pc) {
					return pc.categoryId === category.id;
				});
			});
			return categories.map(function (c) {
				return c.name;
			}).join(', ');
		};

		vm.editInline = function (event, product, property, placeholder) {
			event.stopPropagation();

			var promise = $mdEditDialog.small({
				modelValue: product[property],
				placeholder: placeholder,
				save: function (input) {
					product[property] = input.$modelValue;
					api.product.update({ id: product.id }, {
						product: product,
						file: null
					}, function () {
						$mdToast.show(
							$mdToast.simple()
								.textContent('Cập nhật mặt hàng thành công!')
								.position('bottom right')
								.hideDelay(3000)
						);
					});					
				},
				targetEvent: event,
				validators: {
					'md-maxlength': 9
				}
			});

			promise.then(function (ctrl) {
				var input = ctrl.getInput();

				input.$viewChangeListeners.push(function () {
					input.$setValidity('mustBeNumber', parseInt(input.$modelValue) >= 0);
				});
			});
		};

		vm.updatePrinter = function (product) {
			api.product.update({ id: product.id }, {
				product: product,
				file: null
			}, function () {
				$mdToast.show(
					$mdToast.simple()
						.textContent('Cập nhật máy in thành công!')
						.position('bottom right')
						.hideDelay(3000)
				);
			});
		};

	}
})();