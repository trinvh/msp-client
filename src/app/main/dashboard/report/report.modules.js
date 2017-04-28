(function () {
    'use strict';

    angular
        .module('app.report',
        [

        ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.report', {
            url: '/report',
            views: {
                'content@app': {
                    templateUrl: 'app/main/dashboard/report/report.html',
                    controller: 'ReportController as vm'
                }
            },
            resolve: {
                Users: function (apiResolver) {
                    return apiResolver.resolve('public@get', {operation: 'users'});
                }
            },
            data: {
                permissions: {
                    only: ['AUTHORIZED'],
                    redirectTo: 'app.login'
                }
            }
        });

        msNavigationServiceProvider.saveItem('app.report', {
            title: 'Lịch sử bán',
            icon: 'icon-chart-line',
            state: 'app.report',
            weight: 2
        });
    }

})();