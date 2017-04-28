(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $q, $state, $auth, $timeout, $window, $mdSidenav, $mdDialog, $translate, $mdToast, msNavigationService, RemoteConfig)
    {
        var vm = this;

        vm.refreshInfo = function() {
            RemoteConfig.resolver().then(function(info) {
                $timeout(function() {
                    vm.Infos = info;
                }, 0);
                if(info.licenseInfo.updateUrl) {
                    $mdDialog.show($mdDialog.confirm({
                        title: 'Có bản cập nhật mới',
                        textContent: 'Đã có phiên bản mới hơn, bạn có muốn tải về ngay không ?',
                        ok: 'Đồng ý',
                        cancel: 'Bỏ qua'
                    })).then(function() {
                        $window.location.href = info.licenseInfo.updateUrl;
                    }, {});
                }
            }, function(err) {
                console.log(err);
            });
        };

        vm.refreshInfo();

        $rootScope.global = {
            search: ''
        };
        vm.UserName = $auth.getPayload().name;
        vm.FirstCharacterName = vm.UserName.charAt(0).toUpperCase();

        vm.bodyEl = angular.element('body');
        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        function logout()
        {
            $auth.logout();
            $state.go('app.login');
        }

        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }

        function toggleMsNavigationFolded()
        {
            msNavigationService.toggleFolded();
        }
    }

})();