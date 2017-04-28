(function ()
{
    'use strict';

    /**
     * Main module of the misapay
     */
    angular
        .module('app.sale', [
            'app.category',
            'app.product',
            'app.material',
            'app.inventory'
        ]).config(config);

    function config(msNavigationServiceProvider) {
        msNavigationServiceProvider.saveItem('sale', {
			title: 'Quản lý hàng hóa',
			group: true,
			weight: 2
		});
    }
})();