(function () {
	'use strict';

	angular
		.module('app.room',
		[

		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.room', {
				url: '/room',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/room/list/list.html',
						controller: 'RoomController as vm'
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			}).state('app.room.create', {
				url: '/create',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/room/create/create.html',
						controller: 'RoomCreateController as vm'
					}
				}
			}).state('app.room.edit', {
				url: '/edit/:id',
				views: {
					'content@app': {
						templateUrl: 'app/main/area/room/edit/edit.html',
						controller: 'RoomEditController as vm'
					}
				},
				resolve: {
					Item: function(apiResolver, $stateParams) {
                        return apiResolver.resolve('room@get', {id: $stateParams.id});
                    }
				}
			});

		msNavigationServiceProvider.saveItem('area.room', {
			title: 'Khu vực / Phòng',
			icon: 'icon-scale-bathroom',
			state: 'app.room',
			weight: 1,
		});
	}

})();