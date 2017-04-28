(function () {
	'use strict';

	angular.module('app.utilities.wallpaper', [
		'flow'
	]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		$stateProvider
			.state('app.utilities.wallpaper', {
				url: '/wallpaper',
				views: {
					'content@app': {
						templateUrl: 'app/main/utilities/wallpaper/wallpaper.html',
						controller: 'WallpaperController as vm'
					}
				},
				resolve: {
					Items: function (apiResolver) {
						return apiResolver.resolve('wallpaper@query');
					}
				},
				data: {
					permissions: {
						only: ['ADMIN'],
						redirectTo: 'app.login'
					}
				}
			});

		msNavigationServiceProvider.saveItem('utilities.wallpaper', {
			title: 'Wallpaper',
			icon: 'icon-picture',
			weight: 1,
			state: 'app.utilities.wallpaper'
		});
	}
})();