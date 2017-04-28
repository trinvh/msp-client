(function ()
{
    'use strict';

    /**
     * Main module of the misapay
     */
    angular
        .module('app.dashboard', [
            'app.statistic',
            'app.sell',
            'app.report',
            'app.user'
        ]).config(config);

    function config(msNavigationServiceProvider) {
        msNavigationServiceProvider.saveItem('app', {
			title: 'Dashboard',
			group: true,
			weight: 1
		});
    }
})();