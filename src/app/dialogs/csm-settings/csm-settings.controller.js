(function () {
	'use strict';

	angular
		.module('misapay')
		.controller('CSMSettingsController', CSMSettingsController);

	/** @ngInject */
	function CSMSettingsController($mdDialog, $mdToast, api, host) {
		var vm = this;
		vm.mysql = {
			host: host
		};

		vm.submit = function () {
			api.csm.mysql(vm.mysql, function (resp) {
				if (resp.success) {
					$mdToast.show($mdToast.simple({
						textContent: 'Kết nối thành công, đã lưu cấu hình',
						position: 'bottom center',
						hideDelay: 2000
					}));
					$mdDialog.hide({
						result: true,
						message: 'here is some result data'
					});
				} else {
					$mdDialog.cancel();
				}
			}, function (err) {
				$mdDialog.cancel();
			});
		};

		vm.close = function () {
			$mdDialog.cancel();
		};

	}
})();