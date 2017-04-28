(function ()
{
    'use strict';

    angular
        .module('app.auth', [
            'app.auth.login',
            'app.auth.profile'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {

    }
})();