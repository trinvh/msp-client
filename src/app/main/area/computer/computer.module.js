(function () {
	'use strict';

	angular
		.module('app.computer',
		[

		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.computer', {
				url: '/computer',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/computer/list.html',
						controller: 'ComputerController as vm'
					}
				},
				resolve: {
					Rooms: function(apiResolver) {
						return apiResolver.resolve('public@get', {operation: 'rooms'});
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			}).state('app.monitor', {
				url: '/computer/monitor',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/computer/monitor.html',
						controller: 'MonitorController as vm'
					}
				},
				resolve: {
					Rooms: function(apiResolver) {
						return apiResolver.resolve('public@get', {operation: 'rooms'});
					},
					Check: function(apiResolver) {
						return apiResolver.resolve('public@get', {operation: 'check'});
					},
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			});

		msNavigationServiceProvider.saveItem('area.computer', {
			title: 'Danh sách máy tính',
			icon: 'icon-laptop-chromebook',
			state: 'app.computer',
			weight: 3,
		});

		msNavigationServiceProvider.saveItem('area.monitor', {
			title: 'Theo dõi cấu hình máy',
			icon: 'icon-chart-areaspline',
			state: 'app.monitor',
			weight: 4,
		});
	}

})();