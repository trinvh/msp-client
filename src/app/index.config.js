(function () {
    'use strict';

    angular
        .module('misapay')
        .config(config)
        .factory('interceptors', interceptors);

    /** @ngInject */
    function config($translateProvider, $authProvider, $httpProvider, CONFIG, localStorageServiceProvider) {
        $httpProvider.interceptors.push('interceptors');
        // Put your common app configurations here
        $authProvider.loginUrl = CONFIG.HOST_URL + '/connect/token';
        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('vi');
        $translateProvider.useSanitizeValueStrategy();//'sanitize'

        localStorageServiceProvider
            .setPrefix('misapayplus')
            .setStorageType('localStorage')
            .setNotify(true, true);

    }

    function interceptors($rootScope, $q, $injector, $window, $location) {
        var service = {
            request: request,
            response: response,
            responseError: responseError
        };

        return service;

        function request(config) {
            $rootScope.loadingProgress = true;
            return config;
        };

        function response(response) {
            $rootScope.loadingProgress = false;
            return response;
        };

        function responseError(response) {    
      
            if($location.host().indexOf('api.beesoft.vn') > -1) {
                return $q.reject(response);
            }

            var $mdToast = $injector.get('$mdToast');
            var $mdDialog = $injector.get('$mdDialog');
            var $state = $injector.get('$state');
            if(response.data && response.data.error && response.data.message) {
                if(response.status === 402) {
                    $mdDialog.show($mdDialog.confirm({
                        title: 'License hết hạn hoặc không hợp lệ',
                        htmlContent: 'Key bản quyền của bạn đã hết hạn hoặc xác thực không thành công.<br/>Vui lòng gia hạn để có thể tiếp tục sử dụng.<p>Xin cảm ơn!</p>',
                        ok: 'Xem hướng dẫn',
                        cancel: 'Tôi biết rồi'
                    }).content('')).then(function() {
                        $window.location.href = 'https://beesoft.vn';
                    }, function() {});
                } else {
                    var message = response.data.message;
                    if(response.data.errors && response.data.errors.length) {
                        angular.forEach(response.data.errors, function(error) {
                            message += "<br/>" + error;
                        });
                    }
                    $mdToast.show({
                        templateUrl: 'app/dialogs/toast.html',
                        controller: 'ToastController',
                        controllerAs: 'vm',
                        locals: {data: response.data},
                        position: 'bottom right',
                        hideDelay: 0
                    });
                }
                return $q.reject(response);
            }
            switch (response.status) {
                case 401:
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Không có quyền, chuyển về trang đăng nhập!')
                            .position('bottom right')
                            .hideDelay(5000));
                    $state.go('app.login');
                    break;
                case 500:
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Lỗi không xác định, vui lòng thử lại hoặc reload lại trang!')
                            .position('bottom right')
                            .hideDelay(5000));
                    break;
                case -1:
                    var $auth = $injector.get('$auth');
                    $auth.logout();
                    $state.go('app.error');
                default:
                    var message = (response.data && response.data.error_description) ? response.data.error_description : 'Có lỗi, vui lòng thử lại';
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(message)
                            .position('bottom right')
                            .hideDelay(5000));
                    break;
            }
            return $q.reject(response);
        }
    }

})();