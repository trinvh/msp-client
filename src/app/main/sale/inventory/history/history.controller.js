(function () {
	'use strict';

	angular
		.module('app.inventory')
		.controller('InventoryHistoryController', InventoryHistoryController);

	/** @ngInject */
	function InventoryHistoryController($scope, $state, $mdDialog, $mdToast, api) {
		var vm = this;

		vm.selectedRows = [];
		vm.filter = {
			show: false,
			query: {
				fields: ['name'],
				keyword: '',
				order: '-id',
				page: 1,
				limit: 10
			},
			options: {
				debounce: 500
			},
			remove: function () {
				vm.filter.show = false;
				vm.filter.query.keyword = '';
			}
		};

		vm.success = function (data) {
			vm.items = data.items;
			vm.itemsCount = data.total;
		};

		vm.getPromise = function () {
			vm.promise = api.inventory.history(vm.filter.query, vm.success).$promise;
		};

		$scope.$watch('vm.filter.query.keyword', function (newValue, oldValue) {
			vm.filter.query.page = 1;
			vm.getPromise();
		});

		vm.openDetail = function(item, $event) {
			$mdDialog.show({
				parent: angular.element(document.body),
				targetEvent: $event,
				clickOutsideToClose: true,
				templateUrl: 'app/dialogs/inventory/detail.html',
				controller: 'InventoryDetailController',
				controllerAs: 'vm',
				locals: {data: item}
			});
		};

	}
})();