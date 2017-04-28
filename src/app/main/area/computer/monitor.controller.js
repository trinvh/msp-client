(function () {
	'use strict';

	angular
		.module('app.table')
		.controller('MonitorController', MonitorController);

	/** @ngInject */
	function MonitorController($scope, $rootScope, Rooms, MisapayHub, $auth, $interval) {
		var vm = this;

		vm.Timer = null;
		vm.Tables = [];
		vm.isConnected = false;

		vm.filter = {
			show: false,
			query: {
				fields: ['name', 'mainboard', 'cpu', 'gpu'],
				keyword: '',
				order: 'Name',
				page: 1,
				limit: 100
			},
			options: {
				debounce: 500
			},
			remove: function () {
				vm.filter.show = false;
				vm.filter.query.keyword = '';
			}
		};

		vm.interval = 5000;
		vm.intervals = {
			'2 giây': 2000,
			'5 giây': 5000,
			'30 giây': 30000,
			'2 phút': 120000,
			'5 phút': 300000,
		};

		
		$scope.$on('$viewContentLoaded', function () {
			if (!vm.isConnected) {
				MisapayHub.disconnect();
				MisapayHub.connect({ 'token': $auth.getToken() }).done(function () {
					vm.isConnected = true;
					MisapayHub.RequestMonitorHardware();
					vm.startTimer();
				});
			}
		});

		$scope.$on('$destroy', function () {
			vm.stopTimer();
			MisapayHub.disconnect();
		});

		$scope.$on('OnHardwareRefreshed', function ($event, computerName, hardwares) {
			var found = false;
			for (var i = 0; i < vm.Tables.length; i++) {
				if (vm.Tables[i].Name === computerName) {
					vm.Tables[i].Hardwares = hardwares;
					found = true;
					break;
				}
			}
			if (!found) {
				vm.Tables.push({
					Name: computerName,
					Hardwares: hardwares
				});
			}
			$scope.$apply();
		});

		vm.startTimer = function () {
			vm.Timer = $interval(function () {
				if(vm.isConnected) {
					MisapayHub.RequestMonitorHardware();
				}
			}, vm.interval);
		};

		vm.stopTimer = function () {
			if (angular.isDefined(vm.Timer)) {
				$interval.cancel(vm.Timer);
			}
			vm.Timer = null;
		};

		vm.toggleTimer = function() {
			if (!vm.Timer) {
				vm.startTimer();
			} else {
				vm.stopTimer();
			}
		};

		vm.changeInterval = function() {
			vm.stopTimer();
			vm.startTimer();
		}

	}
})();