(function () {
    'use strict';

    angular
        .module('app.sell', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.sell', {
            url: '/sell',
            views: {
                'content@app': {
                    templateUrl: 'app/main/dashboard/sell/sell.html',
                    controller: 'SellController as vm'
                },
                'right@app.sell': {
                    templateUrl: 'app/main/dashboard/sell/views/details.html'
                }
            },
            data: {
                permissions: {
                    only: ['AUTHORIZED'],
                    redirectTo: 'app.login'
                }
            }
        }).state('app.sell.all', {
            url: '/all',
            views: {
                'right@app.sell': {
                    templateUrl: 'app/main/dashboard/sell/views/general.html'
                }
            }
        });

        msNavigationServiceProvider.saveItem('app.sell', {
            title: 'Bán hàng',
            icon: 'icon-cart',
            state: 'app.sell',
            weight: 2
        });
    }

})();