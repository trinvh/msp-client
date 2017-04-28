(function () {
	'use strict';

	angular
		.module('app.product')
		.controller('ProductEditController', ProductEditController);

	/** @ngInject */
	function ProductEditController($state, $mdDialog, api, Item, Categories, Printers, Materials, CONFIG) {
		var vm = this;
		vm.form = Item.toJSON();
		vm.form.productMaterials = Materials.items.map(function(item) {
			var quantity = 0;
			angular.forEach(vm.form.productMaterials, function(pm) {
				if(pm.materialId == item.id) quantity = pm.quantity;
			});
			return {
				materialId: item.id,
				name: item.name,
				quantity: quantity
			};
		});
		vm.printers = Printers.items;
		vm.categories = Categories.items.map(function(item) {
			return {
				categoryId: item.id,
				name: item.name
			}	
		});
		vm.isEdit = true;

		vm.submit = function () {
			var file = vm.flow.files.length ? vm.flow.files[0].file : null;
			api.product.update({ id: vm.form.id }, {
				product: vm.form,
				file: file
			}, function () {
				$state.go('app.product');
			});
		};

		vm.imageChange = function ($file, event, $flow) {
			if (['jpg', 'png', 'jpeg', 'gif'].indexOf($file.getExtension()) < 0) {
				$mdToast.show($mdToast.simple({
					textContent: 'Ảnh chỉ chấp nhận định đạng JPG, JPEG, PNG và GIF',
					position: 'bottom right'
				}));
				return false;
			}
		};

		vm.getImage = function(image) {
			return CONFIG.HOST_URL + '/' + image;
		};

	}
})();