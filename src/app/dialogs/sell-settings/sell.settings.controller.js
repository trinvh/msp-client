(function() {
	'use strict';

	angular.module('misapay')
		.controller('SellSettingsController', SellSettingsController);

	/** @ngInject */
	function SellSettingsController($scope, $mdDialog) {
		var vm = this;

		vm.close = function() {
			$mdDialog.cancel();
		};
	}
	
})();