(function () {
    'use strict';

    /**
     * Main module of the misapay
     */
    angular
        .module('misapay', [
            'satellizer',            
            'datatables',
            'md.data.table',
            'ngMaterialDatePicker',
            'angularMoment',
            'ngAvatar',
            'angular-web-notification',
            'mcwebb.sound',
            'SignalR',
            'hc.marked',
            'angularResizable',
            'LocalStorageModule',
            'app'
        ]);
})();