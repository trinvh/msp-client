(function () {
	'use strict';

	angular
		.module('misapay')
		.controller('ToastController', ToastController);

	/** @ngInject */
	function ToastController($mdToast, data) {
		var vm = this;
		vm.data = data;

		vm.hide = function() {
			$mdToast.hide();
		};

	}
})();