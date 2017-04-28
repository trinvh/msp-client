(function() {
	'use strict';

	angular.module('app.utilities',[
		'app.utilities.wallpaper',
		'app.utilities.csm'
	]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		$stateProvider
			.state('app.utilities', {
				url: '/utilities',
				abstract: true
			});
		
		msNavigationServiceProvider.saveItem('utilities', {
			title: 'Tiện ích',
			group: true,
			weight: 4
		});
	}
})();