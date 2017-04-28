(function() {
	'use strict';

	angular.module('app.settings.configuration',[])
		.config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		$stateProvider
			.state('app.settings.configuration', {
				url: '/configuration',
				views: {
					'content@app': {
						templateUrl: 'app/main/settings/configuration/configuration.html',
						controller: 'ConfigurationController as vm'
					}
				},
				params: {tab: 0},
				resolve: {
					Printers: function(apiResolver) {
						return apiResolver.resolve('public@get', {operation: 'printers'});
					},
					Settings: function(apiResolver) {
						return apiResolver.resolve('setting@query');
					},
					Info: function(apiResolver) {
						return apiResolver.resolve('info@get');
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			});

		msNavigationServiceProvider.saveItem('settings.configuration', {
			title: 'Tùy chọn',
			icon: 'icon-brightness-7',
			state: 'app.settings.configuration',
			weight: 3,
		});
	}
})();