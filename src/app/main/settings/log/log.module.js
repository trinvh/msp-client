(function() {
	'use strict';

	angular.module('app.settings.log',[])
		.config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		$stateProvider
			.state('app.settings.log', {
				url: '/log',
				views: {
					'content@app': {
						templateUrl: 'app/main/settings/log/log.html',
						controller: 'LogController as vm'
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			});

		msNavigationServiceProvider.saveItem('settings.log', {
			title: 'Nhật ký hệ thống',
			icon: 'icon-history',
			state: 'app.settings.log',
			weight: 2,
		});
	}
})();