(function ()
{
    'use strict';

    angular
        .module('app.error', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.error', {
            url      : '/error',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.error': {
                    templateUrl: 'app/main/error/error.html',
                }
            },
        });
    }

})();