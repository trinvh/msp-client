(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('misapayConfig', misapayConfigProvider);

    /** @ngInject */
    function misapayConfigProvider()
    {
        // Default configuration
        var misapayConfiguration = {
            'disableCustomScrollbars'        : false,
            'disableMdInkRippleOnMobile'     : true,
            'disableCustomScrollbarsOnMobile': true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            misapayConfiguration = angular.extend({}, misapayConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getConfig: getConfig,
                setConfig: setConfig
            };

            return service;

            //////////

            /**
             * Returns a config value
             */
            function getConfig(configName)
            {
                if ( angular.isUndefined(misapayConfiguration[configName]) )
                {
                    return false;
                }

                return misapayConfiguration[configName];
            }

            /**
             * Creates or updates config object
             *
             * @param configName
             * @param configValue
             */
            function setConfig(configName, configValue)
            {
                misapayConfiguration[configName] = configValue;
            }
        };
    }

})();