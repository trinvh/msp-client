(function () {
    'use strict';

    angular
        .module('app', [
            'SignalR',
            'app.core',
            'app.navigation',
            'app.toolbar',
            'app.quick-panel',
            'app.error',
            'app.auth',
            'app.dashboard',
            'app.sale',
            'app.area',
            'app.utilities',
            'app.settings'
        ]);
})();