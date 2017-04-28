(function () {
	'use strict';

	angular
		.module('app.auth.profile')
		.controller('ProfileController', ProfileController);

	/** @ngInject */
	function ProfileController($state, $mdDialog, api, $auth) {
		var vm = this;

		vm.profile = $auth.getPayload();
		vm.FirstCharacterName = vm.profile.name.charAt(0).toUpperCase();
		
		vm.submit = function() {
			api.account.password(vm.form, function() {
				$mdDialog.show($mdDialog.alert({
					title: 'Đổi mật khẩu thành công',
					textContent: 'Bạn đã đổi mật khẩu thành công, sau đây bạn sẽ được chuyển về trang đăng nhập',
					ok: 'Đồng ý'
				})).finally(function() {
					$state.go('app.login');	
				});
			});
		}

	}
})();