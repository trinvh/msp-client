(function () {
	'use strict';

	angular
		.module('app.table')
		.controller('TableController', TableController);

	/** @ngInject */
	function TableController($scope, $state, $mdDialog, $mdToast, api, Rooms) {
		var vm = this;
		vm.Rooms = Rooms;

		vm.updateRoom = function (table) {
			api.table.update({ id: table.id }, table, function () {
				$mdToast.show(
					$mdToast.simple()
						.textContent('Cập nhật bàn thành công!')
						.position('bottom right')
						.hideDelay(3000)
				);
			});
		};

		vm.selectedRows = [];
		vm.filter = {			
			show: false,
			query: {
				keyword: '',
				order: '',
				page: 1,
				limit: 10,
				fields: ['name'],
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
			vm.promise = api.table.get(vm.filter.query, vm.success).$promise;
		};

		$scope.$watch('vm.filter.query.keyword', function (newValue, oldValue) {
			vm.filter.query.page = 1;
			vm.getPromise();
		});

		vm.destroy = function (item) {
			var confirm = $mdDialog.confirm()
				.title('Bạn thực sự muốn xóa?')
				.textContent('Thao tác xóa sẽ không hồi lại được')
				.ariaLabel('Lucky day')
				.ok('Chắc chắn xóa')
				.cancel('Bỏ qua');

			$mdDialog.show(confirm).then(function () {
				api.table.delete(item, function () {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Xóa thành công!')
							.position('bottom right')
							.hideDelay(3000)
					);
					vm.getPromise();
				});
			});
		};

	}
})();