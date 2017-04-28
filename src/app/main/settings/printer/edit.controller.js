(function () {
	'use strict';

	angular
		.module('app.settings.printer')
		.controller('PrinterEditController', PrinterEditController);

	/** @ngInject */
	function PrinterEditController($state, $mdDialog, api, Item, Printers) {
		var vm = this;
		vm.form = Item;
		vm.Printers = Printers;
		
		vm.submit = function() {
			api.printer.update({id:vm.form.id}, vm.form, function() {
				$state.go('app.settings.printer');
			});
		}

	}
})();