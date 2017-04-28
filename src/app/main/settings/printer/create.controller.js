(function () {
	'use strict';

	angular
		.module('app.settings.printer')
		.controller('PrinterCreateController', PrinterCreateController);

	/** @ngInject */
	function PrinterCreateController($state, $mdDialog, api, Printers) {
		var vm = this;
		vm.Printers = Printers;
		vm.form = {
			paperSize: 60
		};
		
		vm.submit = function() {
			api.printer.save(vm.form, function() {
				$state.go('app.settings.printer');
			});
		}

	}
})();