(function () {
    'use strict';

    angular
        .module('misapay')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, PermRoleStore, PermPermissionStore, $auth, $mdToast, SoundService, CONFIG, amMoment) {
        amMoment.changeLocale('vi');
        PermRoleStore.defineManyRoles({
            'AUTHORIZED': function () {
                return $auth.isAuthenticated();
            },
            'ADMIN': function () {
                return $auth.isAuthenticated() && $auth.getPayload().role === 'Admin';
            }
        });
        PermPermissionStore.defineManyPermissions(Object.keys(CONFIG.PERMISSIONS), function (permissionName) {
            // Fix edge
            var permissions = $auth.getPayload().Permission || $auth.getPayload().permission || [];
            return $auth.isAuthenticated() 
                && permissions.indexOf(CONFIG.PERMISSIONS[permissionName]) > -1;
        });

        // Register SoundService
        SoundService.loadSound({
            name: 'ring',
            src: '/assets/sounds/order.wav'
        });

        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });

        $rootScope.$on('$stateChangeError', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        $rootScope.$on('$stateChangePermissionDenied', function (event, toState, toParams, options) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Bạn không có quyền truy cập chức năng này !')
                    .position('bottom right')
                    .hideDelay(3000)
            );
        });
        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();