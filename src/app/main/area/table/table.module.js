(function () {
	'use strict';

	angular
		.module('app.table',
		[

		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.table', {
				url: '/table',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/table/list/list.html',
						controller: 'TableController as vm'
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
			}).state('app.table.create', {
				url: '/create',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/table/create/create.html',
						controller: 'TableCreateController as vm'
					}
				},
				resolve: {
					Rooms: function(apiResolver) {
						return apiResolver.resolve('room@get');
					}
				}
			}).state('app.table.edit', {
				url: '/edit/:id',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/table/edit/edit.html',
						controller: 'TableEditController as vm'
					}
				},
				resolve: {
					Item: function(apiResolver, $stateParams) {
                        return apiResolver.resolve('table@get', {id: $stateParams.id});
                    },
					Rooms: function(apiResolver) {
						return apiResolver.resolve('room@get');
					}
				}
			});

		msNavigationServiceProvider.saveItem('area.table', {
			title: 'Danh sách bàn',
			icon: 'icon-table',
			state: 'app.table',
			weight: 2,
		});
	}

})();