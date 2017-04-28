(function () {
    'use strict';

    angular
        .module('misapay')
        .constant('CONFIG', (function () {
            var debugging = false;
            var host_url = !debugging ? '' : 'http://localhost:5000';
            var api_url = host_url + '/api';
            var signal_url = host_url + '/signalr';
            var definedPermissions = Object.freeze({
                CanAddNewService: "Tự thêm dịch vụ",
                CanCancelCustomerServices: "Hủy dịch vụ khách gọi",
                CanPrintReceiptAgain: "In lại hóa đơn",
                CanImportGoods: "Quản lý tồn kho",
                CanManageComputers: "Quản lý máy tính",
                CanManageCoffees: "Quản lý bàn cà phê",
                CanManageBillards: "Quản lý bàn billard"
            });

            return {
                'HOST_URL': host_url,
                'API_URL': api_url,
                'SIGNALR_URL': signal_url,
                'PERMISSIONS': definedPermissions
            };
        })());
})();
