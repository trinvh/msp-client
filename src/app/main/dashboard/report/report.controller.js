(function () {
	'use strict';

	angular
		.module('app.report')
		.controller('ReportController', ReportController);

	/** @ngInject */
	function ReportController($mdDialog, $scope, api, Users, mdcDateTimeDialog) {
		var vm = this;
		vm.isExpanded = true;
		vm.productGroup = true;
		vm.startTime = moment().startOf('day');
		vm.endTime = moment();
		vm.selectedUser = {
			id: 0,
			userName: 'Tất cả'	
		};
		Users.unshift(vm.selectedUser);
		vm.users = Users;

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
			vm.categories = data.categories;
			vm.products = data.categories.map(function (c) {
				return c.products;
			}).reduce(function (a, b) {
				return a.concat(b);
			}).sort(function (a, b) {
				var nameA = a.name.toUpperCase();
				var nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
			vm.materials = data.materials;
			vm.amount = data.amount;
			vm.quantity = data.quantity;
			vm.revenue = data.revenue;
		};

		vm.getPromise = function () {
			vm.filter.query.userId = vm.selectedUser.id;
			vm.filter.query.startTime = vm.startTime;
			vm.filter.query.endTime = vm.endTime;
			vm.promise = api.report.get(vm.filter.query, vm.success).$promise;
		};

	}
})();