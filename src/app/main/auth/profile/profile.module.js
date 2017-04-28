(function () {
	'use strict';

	angular
		.module('app.auth.profile',
		[]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.profile', {
				url: '/profile',
				views: {
					'content@app': {
						templateUrl: 'app/main/auth/profile/profile.html',
						controller: 'ProfileController as vm'
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			});
	}

})();