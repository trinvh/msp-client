(function () {
    'use strict';

    angular
        .module('app.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(CONFIG, $auth, $state, $httpParamSerializer, $mdToast, PermRoleStore) {
        var vm = this;
        if ($auth.isAuthenticated()) {
            $auth.logout();
        }

        vm.login = function __login() {
            vm.isLoading = true;
            $auth.login($httpParamSerializer({
                username: vm.form.username,
                password: vm.form.password,
                grant_type: 'password',
                scope: 'offline_access profile email roles'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                }).then(function (response) {
                    vm.isLoading = false;
                    $auth.setToken(response.data.access_token);
                    if ($auth.getPayload().role === 'Admin') {
                        $state.go('app.statistic');
                    } else {
                        $state.go('app.sell');
                    }
                }).catch(function (response) {
                    vm.isLoading = false;
                    console.log(response);
                });
        }
    }
})();