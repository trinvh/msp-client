(function () {
	'use strict';

	angular
		.module('app.settings',
		[
			'app.settings.printer',
			'app.settings.log',
			'app.settings.configuration'
		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.settings', {
				url: '/settings',
				abstract: true
			});

		msNavigationServiceProvider.saveItem('settings', {
			title: 'Cấu hình',
			group: true,
			weight: 5
		});
	}

})();