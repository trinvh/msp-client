(function () {
	'use strict';

	angular
		.module('app.user',
		[

		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.user', {
				url: '/user',
				views: {
					'content@app': {
						templateUrl: 'app/main/dashboard/user/list/list.html',
						controller: 'UserController as vm'
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			}).state('app.user.create', {
				url: '/create',
				views: {
					'content@app': {
						templateUrl: 'app/main/dashboard/user/create/create.html',
						controller: 'UserCreateController as vm'
					}
				},
				resolve: {
					Permissions: function(apiResolver) {
						return apiResolver.resolve('permission@query');
					}
				}
			}).state('app.user.edit', {
				url: '/edit/:id',
				views: {
					'content@app': {
						templateUrl: 'app/main/dashboard/user/edit/edit.html',
						controller: 'UserEditController as vm'
					}
				},
				resolve: {
					Item: function(apiResolver, $stateParams) {
                        return apiResolver.resolve('user@get', {id: $stateParams.id});
                    },
					Permissions: function(apiResolver) {
						return apiResolver.resolve('permission@query');
					}
				}
			});

		msNavigationServiceProvider.saveItem('app.user', {
			title: 'Nhân viên',
			icon: 'icon-person-box',
			state: 'app.user',
			weight: 1,
		});
	}

})();