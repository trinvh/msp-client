(function () {
	'use strict';

	angular
		.module('app.category')
		.controller('CategoryEditController', CategoryEditController);

	/** @ngInject */
	function CategoryEditController($state, $mdDialog, api, Item) {
		var vm = this;
		vm.form = Item;
		
		vm.submit = function() {
			api.category.update({id:vm.form.id}, vm.form, function() {
				$state.go('app.category');
			});
		}

	}
})();