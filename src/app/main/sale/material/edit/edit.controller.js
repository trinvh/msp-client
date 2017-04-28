(function () {
	'use strict';

	angular
		.module('app.material')
		.controller('MaterialEditController', MaterialEditController);

	/** @ngInject */
	function MaterialEditController($state, $mdDialog, api, Item) {
		var vm = this;
		vm.form = Item;
		
		vm.submit = function() {
			api.material.update({id:vm.form.id}, vm.form, function() {
				$state.go('app.material');
			});
		}

	}
})();