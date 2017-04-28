(function() {
	'use strict';

	angular.module('misapay')
		.controller('PrintConfirmController', PrintConfirmController);

	/** @ngInject */
	function PrintConfirmController($mdDialog, Table) {
		var vm = this;
		vm.allowReceipt = Table.TableType !== 0 && Table.TableType !== 1;

		vm.cancel = function() {
			$mdDialog.cancel();
		};

		vm.submit = function() {
			$mdDialog.hide(vm.allowReceipt);
		}
	}
})();