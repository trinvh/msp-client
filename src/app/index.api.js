(function () {
    'use strict';

    angular
        .module('misapay')
        .factory('api', apiService);

    /** @ngInject */
    function apiService(CONFIG, $resource) {
        var api = {};
        api.baseUrl = CONFIG.API_URL;

        api.remote = $resource('https://api.beesoft.vn/v2/info');

        api.info = $resource(api.baseUrl + '/info');

        api.dashboard = $resource(api.baseUrl + '/dashboard');

        api.public = $resource(api.baseUrl + '/public/:operation', {},
            {
                'get': { method: 'GET', isArray: true },
            });

        api.account = $resource(api.baseUrl + '/account', {},{
            'password': {
                url: api.baseUrl + '/account/password',
                method: 'POST'
            }
        });
        
        api.user = $resource(api.baseUrl + '/users/:id');

        api.permission = $resource(api.baseUrl + '/permissions');

        api.report = $resource(api.baseUrl + '/reports/:operation',
            {
                operation: '@operation'
            },
            {
                'list': { method: 'POST', isArray: false, params: { operation: 'list' } },
                'get': { isArray: false, method: 'POST' }
            });
        api.user = $resource(api.baseUrl + '/users/:id', {}, {
            'update': { method: 'PUT' }
        });

        api.category = $resource(api.baseUrl + '/categories/:id', {}, {
            'update': { method: 'PUT' }
        });

        api.product = $resource(api.baseUrl + '/products/:id', {}, {
            'update': {
                method: 'PUT',
                transformRequest: function (data, headersGetter) {
                    if (data == undefined) {
                        return data;
                    }
                    var fd = new FormData();
                    addToFd(data, [], fd);
                    return fd;
                },
                headers: { 'Content-Type': undefined }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data, headersGetter) {
                    if (data == undefined) {
                        return data;
                    }
                    var fd = new FormData();
                    addToFd(data, [], fd);
                    return fd;
                },
                headers: { 'Content-Type': undefined }
            }
        });

        api.material = $resource(api.baseUrl + '/materials/:id', {}, {
            'update': { method: 'PUT' }
        });

        api.inventory = $resource(api.baseUrl + '/inventories/:id', {}, {
            'query': { isArray: false },
            'history': {
                method: 'GET',
                url: api.baseUrl + '/inventories/histories'
            }
        });

        api.room = $resource(api.baseUrl + '/rooms/:id', {}, {
            'update': { method: 'PUT' }
        });

        api.table = $resource(api.baseUrl + '/tables/:id', {}, {
            'update': { method: 'PUT' },
        });

        api.computer = $resource(api.baseUrl + '/computers/:id', {}, {
            'update': { method: 'PUT' },
        });

        api.wallpaper = $resource(api.baseUrl + '/wallpapers/:id', {}, {
            'update': { method: 'PUT'},
            'save': {
                method: 'POST',
                transformRequest: function (data, headersGetter) {
                    if (data == undefined) {
                        return data;
                    }
                    var fd = new FormData();
                    addToFd(data, [], fd);
                    return fd;
                },
                headers: { 'Content-Type': undefined }
            }
        });

        api.printer = $resource(api.baseUrl + '/printers/:id', {}, {
            'update': { method: 'PUT' },
            'list': {
                method: 'GET',
                isArray: true,
                url: api.baseUrl + '/printers/list'
            }
        });

        api.log = $resource(api.baseUrl + '/logs');

        api.setting = $resource(api.baseUrl + '/settings/:id', {}, {
            'update': { method: 'PUT' },
        });

        api.csm = $resource(api.baseUrl + '/csm', {}, {
            'mysql': { 
                method: 'PUT',
                url: api.baseUrl + '/csm/mysql'
            },
            'staffs': {
                method: 'GET',
                isArray: true,
                url: api.baseUrl + '/csm/staffs'
            },
            'get': { isArray: false, method: 'POST' }
        });

        var createKey = function (_keys_, currentKey) {
            var keys = angular.copy(_keys_);
            keys.push(currentKey);
            var formKey = keys.shift()

            if (keys.length) {
                formKey += "[" + keys.join("][") + "]"
            }

            return formKey;
        };

        var addToFd = function (object, keys, fd) {
            angular.forEach(object, function (value, key) {
                var formKey = createKey(keys, key);

                if (value instanceof File) {
                    fd.append(formKey, value);
                } else if (value instanceof FileList) {
                    if (value.length == 1) {
                        fd.append(formKey, value[0]);
                    } else {
                        angular.forEach(value, function (file, index) {
                            fd.append(formKey + '[' + index + ']', file);
                        });
                    }
                } else if (value && (typeof value == 'object' || typeof value == 'array')) {
                    var _keys = angular.copy(keys);
                    _keys.push(key)
                    addToFd(value, _keys, fd);
                } else {
                    fd.append(formKey, value);
                }
            });
        };

        return api;
    }

})();