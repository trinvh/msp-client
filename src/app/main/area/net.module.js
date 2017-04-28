(function ()
{
    'use strict';

    /**
     * Main module of the misapay
     */
    angular
        .module('app.area', [
            'app.room',
            'app.table',
            'app.computer'
        ]).config(config);

    function config(msNavigationServiceProvider) {
        msNavigationServiceProvider.saveItem('area', {
			title: 'Phòng máy',
			group: true,
			weight: 3
		});
    }
})();