(function ()
{
    'use strict';

    angular
        .module('app.statistic', [
            'chart.js'
        ]).config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.statistic', {
                url    : '/statistic',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard/statistic/statistic.html',
                        controller : 'StatisticController as vm'
                    }
                },
                resolve: {
                    Dashboard: function(apiResolver) {
                        return apiResolver.resolve('dashboard@get');
                    }
                },
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
            });

        msNavigationServiceProvider.saveItem('app.statistic', {
            title    : 'Tổng quan',
            icon     : 'icon-chart-bar',
            state    : 'app.statistic',
            weight   : 1
        });
    }
})();