(function () {
	'use strict';

	angular
		.module('app.room')
		.controller('RoomController', RoomController);

	/** @ngInject */
	function RoomController($scope, $state, $mdDialog, $mdToast, api) {
		var vm = this;

		vm.selectedRows = [];
		vm.filter = {
			show: false,
			query: {
				fields: ['name'],
				keyword: '',
				order: '',
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
			vm.promise = api.room.get(vm.filter.query, vm.success).$promise;
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
				api.room.delete({id: item.id}, item, function () {
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