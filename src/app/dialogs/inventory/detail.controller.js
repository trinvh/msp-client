(function () {
	'use strict';

	angular
		.module('misapay')
		.controller('InventoryDetailController', InventoryDetailController);

	/** @ngInject */
	function InventoryDetailController($mdDialog, data) {
		var vm = this;
		vm.data = data;

		vm.close = function() {
			$mdDialog.cancel();
		};

	}
})();