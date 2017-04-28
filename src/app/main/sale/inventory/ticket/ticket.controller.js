(function () {
	'use strict';

	angular.module('app.inventory')
		.controller('InventoryTicketController', InventoryTicketController);

	/** @ngInject */
	function InventoryTicketController(Data, $mdToast, api) {
		var vm = this;

		vm.materials = Data.materials;
		vm.products = Data.products;
		vm.note = "Cân bằng kho ngày " + moment().format('Y-m-d HH:mm:ss');

		vm.getTotalChanged = function () {
			var materialChanged = vm.materials.filter(function (item) {
				return item.oldInventory !== item.inventory;
			}).length;

			var productChanged = vm.products.filter(function (item) {
				return item.oldInventory !== item.inventory;
			}).length;

			return materialChanged + productChanged;
		};

		vm.getTotalAmount = function () {
			var total = 0;
			angular.forEach(vm.products, function (item) {
				total += (item.inventory - item.oldInventory) * item.price;
			});
			return total;
		};

		vm.reset = function () {
			vm.materials.map(function (item) {
				item.inventory = item.oldInventory;
			});
			vm.products.map(function (item) {
				item.inventory = item.oldInventory;
			});
		};

		vm.submit = function () {
			var data = {
				materials: vm.materials,
				products: vm.products,
				note: vm.note
			};
			api.inventory.save(data, function() {
				$mdToast.show($mdToast.simple({
					textContent: 'Cân bằng kho thành công',
					position: 'bottom right',
					hideDelay: 5000
				}));
			});
		};
	}

})();