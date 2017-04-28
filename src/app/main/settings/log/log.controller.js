(function() {
	'use strict';

	angular
		.module('app.settings.log')
		.controller('LogController', LogController);

	/** @ngInject */
	function LogController($scope, api) {
		var vm = this;
		
		vm.selectedRows = [];
		vm.filter = {
			show: false,
			query: {
				fields: ['message', 'type', 'createdTime'],
				keyword: '',
				order: '-id',
				page: 1,
				limit: 10
			},
			options: {
				debounce: 500
			},
			toggle: function () {
				vm.filter.show = !vm.filter.show;
				vm.filter.query.keyword = '';
			}
		};

		vm.success = function (data) {
			vm.items = data.items;
			vm.itemsCount = data.total;
		};

		vm.getPromise = function () {
			vm.promise = api.log.get(vm.filter.query, vm.success).$promise;
		};

		$scope.$watch('vm.filter.query.keyword', function (newValue, oldValue) {
			vm.filter.query.page = 1;
			vm.getPromise();
		});
	}
})();