(function () {
	'use strict';

	angular.module('app.utilities.csm', []).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		$stateProvider
			.state('app.utilities.csm', {
				url: '/csm',
				views: {
					'content@app': {
						templateUrl: 'app/main/utilities/csm/csm.html',
						controller: 'CsmController as vm'
					}
				},
				resolve: {
					CsmIntergration: function(apiResolver) {
						return apiResolver.resolve('setting@get', {id: 'CSMValid'});
					}
				},
				data: {
					permissions: {
						only: ['AUTHORIZED'],
						redirectTo: 'app.login'
					}
				}
			});
		msNavigationServiceProvider.saveItem('utilities.csm', {
			title: 'Báo cáo CSM',
			icon: 'icon-chart-arc',
			weight: 2,
			state: 'app.utilities.csm'
		});

	}
})();