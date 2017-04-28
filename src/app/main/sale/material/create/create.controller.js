(function () {
	'use strict';

	angular
		.module('app.material')
		.controller('MaterialCreateController', MaterialCreateController);

	/** @ngInject */
	function MaterialCreateController($state, $mdDialog, api) {
		var vm = this;
		vm.form = {
			allowInventory: true,
			inventory: 0
		};
		
		vm.submit = function() {
			api.material.save(vm.form, function() {
				$state.go('app.material');
			});
		}

	}
})();