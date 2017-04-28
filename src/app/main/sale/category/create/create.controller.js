(function () {
	'use strict';

	angular
		.module('app.category')
		.controller('CategoryCreateController', CategoryCreateController);

	/** @ngInject */
	function CategoryCreateController($state, $mdDialog, api) {
		var vm = this;
		vm.form = {
			sortOrder: 1
		};
		
		vm.submit = function() {
			api.category.save(vm.form, function() {
				$state.go('app.category');
			});
		}

	}
})();