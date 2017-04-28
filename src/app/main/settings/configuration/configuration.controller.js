(function () {
	'use strict';

	angular
		.module('app.settings.configuration')
		.controller('ConfigurationController', ConfigurationController);

	/** @ngInject */
	function ConfigurationController($scope, $stateParams, $mdDialog, api, Printers, Settings, Info) {
		var vm = this;
		vm.selectedTab = $stateParams.tab;
		vm.phonePattern = /^\+?\d{2}[- ]?\d{3,4}[- ]?\d{5,6}$/;
		vm.Info = Info;
		vm.Printers = Printers;
		vm.Settings = JSON.parse(angular.toJson(Settings));

		vm.toggleUseCSM = function() {
			if(vm.getSetting('CSMValid').value === true) {
				$mdDialog.show({
					templateUrl: 'app/dialogs/csm-settings/csm-settings.html',
					controller: 'CSMSettingsController as vm',
					locals: {
						host: vm.getSetting('MysqlHost').value
					}
				}).then(function(data) {
					
				}, function(err) {
					vm.getSetting('CSMValid').value = false;
				});
			}
		}
		
		vm._parseSettings = function () {
			for (var i = 0; i < vm.Settings.length; i++) {
				if (vm.Settings[i].key === 'ReceiptPrinter') vm.Settings[i].value = parseInt(vm.Settings[i].value);
				else if (vm.Settings[i].key === 'PreventBuyIfInventoryEqualsZero'
					|| vm.Settings[i].key === 'DailyBackup'
					|| vm.Settings[i].key === 'ReportDaily'
					|| vm.Settings[i].key === 'ReportWarningHardware'
					|| vm.Settings[i].key === 'ReportCSMDaily'
					|| vm.Settings[i].key === 'CSMValid') {
					vm.Settings[i].value = String(vm.Settings[i].value).toLowerCase() === 'true';
				} else if(vm.Settings[i].key === 'ReportDailyTime') {
					vm.Settings[i].value = new Date(vm.Settings[i].value);
				}
			}
		};
		vm._parseSettings();

		vm.getSetting = function (key) {
			for (var i = 0; i < vm.Settings.length; i++) {
				if (vm.Settings[i].key === key) {
					return vm.Settings[i];
				}
			}
			return { id: 0, key: '', value: '' }
		};

		vm.submit = function () {
			api.setting.update("", vm.Settings, function () {
				$mdDialog.show(
					$mdDialog.alert()
						.title('Cấu hình phần mềm')
						.textContent('Bạn đã cập nhật cấu hình phần mềm thành công')
						.ok('Got it!')
				);
			});
		}
	}
})();