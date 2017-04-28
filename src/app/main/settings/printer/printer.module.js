(function () {
	'use strict';

	angular
		.module('app.settings.printer',
		[

		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.settings.printer', {
				url: '/printer',
				views: {
					'content@app': {
						templateUrl: 'app/main/settings/printer/list.html',
						controller: 'PrinterController as vm'
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			}).state('app.settings.printer.create', {
				url: '/create',
				views: {
					'content@app': {
						templateUrl: 'app/main/settings/printer/create.html',
						controller: 'PrinterCreateController as vm'
					}
				},
				resolve: {
					Printers: function(apiResolver) {
						return apiResolver.resolve('printer@list');
					}
				}
			}).state('app.settings.printer.edit', {
				url: '/edit/:id',
				views: {
					'content@app': {
						templateUrl: 'app/main/settings/printer/edit.html',
						controller: 'PrinterEditController as vm'
					}
				},
				resolve: {
					Printers: function(apiResolver) {
						return apiResolver.resolve('printer@list');
					},
					Item: function(apiResolver, $stateParams) {
						return apiResolver.resolve('printer@get', {id: $stateParams.id});
					}
				}
			});

		msNavigationServiceProvider.saveItem('settings.printer', {
			title: 'Quản lý máy in',
			icon: 'icon-printer',
			state: 'app.settings.printer',
			weight: 1,
		});
	}

})();