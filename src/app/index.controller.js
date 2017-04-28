(function ()
{
    'use strict';

    angular
        .module('misapay')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(misapayTheming)
    {
        var vm = this;

        // Data
        vm.themes = misapayTheming.themes;

        //////////
    }
})();