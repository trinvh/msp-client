(function () {
	'use strict';

	angular
		.module('app.utilities.csm')
		.controller('CsmController', CsmController);

	/** @ngInject */
	function CsmController($mdDialog, $scope, $state, api, mdcDateTimeDialog, CsmIntergration) {
		var vm = this;
		vm.totalAmount = 0;
		vm.startTime = moment().startOf('day');
		vm.endTime = moment();
		vm.selectedUser = {
			userId: 0,
			userName: 'Tất cả'
		};
		vm.users = [vm.selectedUser];
		if (String(CsmIntergration.value).toLowerCase() !== 'true') {
			alert = $mdDialog.alert({
				title: 'Cấu hình không chính xác',
				textContent: 'Bạn không thể sử dụng chức năng này trước khi cấu hình chính xác thông số MYSQL',
				ok: 'Cấu hình CSM'
			});
			$mdDialog
				.show(alert)
				.finally(function () {
					$state.go('app.settings.configuration', { tab: 1 });
				});
		} else {
			api.csm.staffs(function (items) {
				angular.forEach(items, function (user) {
					vm.users.push(user);
				})
			}, function (err) { });
		}

		vm.getUserName = function (item) {
			if (item.machineName !== '') {
				return item.machineName;
			} else if (item.user.middleName !== '') {
				return item.user.middleName;
			} else if (item.user.firstName !== '') {
				return item.user.firstName;
			} else if (item.user.lastName !== '') {
				return item.user.lastName;
			} else {
				return "******";
			}
		}

		vm.submit = function () {
			var isDateValid = true;
			if (!moment(vm.startTime, 'DD-MM-YYYY HH:mm').isValid()) {
				vm.startTime = moment().startOf('day');
				isDateValid = false;
			}
			if (!moment(vm.endTime, 'DD-MM-YYYY HH:mm').isValid()) {
				vm.endTime = moment();
				isDateValid = false;
			}
			if (isDateValid) {
				vm.getPromise();
			}
		};

		vm.selectDate = function (whichDate) {
			mdcDateTimeDialog.show({
				maxDate: moment()
			}).then(function (date) {
				if (whichDate === 'from') {
					vm.startTime = moment(date);
				} else {
					vm.endTime = moment(date);
				}
			});
		};

		vm.selectedRows = [];

		vm.filter = {
			show: false,
			query: {
				fields: [],
				keyword: '',
				order: '-voucherId',
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
			vm.totalAmount = data.amount;
		};

		vm.getPromise = function () {
			vm.filter.query.userId = vm.selectedUser.userId;
			vm.filter.query.startTime = vm.startTime;
			vm.filter.query.endTime = vm.endTime;
			vm.promise = api.csm.get(vm.filter.query, vm.success).$promise;
		};


	}
})();