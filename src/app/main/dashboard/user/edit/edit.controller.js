(function () {
	'use strict';

	angular
		.module('app.user')
		.controller('UserEditController', UserEditController);

	/** @ngInject */
	function UserEditController($state, $mdDialog, api, Item, Permissions) {
		var vm = this;
		vm.form = Item;
		vm.permissions = Permissions;
		vm.isEdit = true;
		
		vm.submit = function() {
			api.user.update({id:vm.form.id}, vm.form, function() {
				$state.go('app.user');
			});
		};

		vm.checkPermission = function (permission) {
			if (vm.form.claims && vm.form.claims.length) {
				var existed = false;
				angular.forEach(vm.form.claims, function (claim) {
					if (!existed) {
						if (claim.claimValue === permission) existed = true;
					}
				});
				return existed;
			}
			return false;
		};

		vm.togglePermission = function (permission) {
			var existed = false;
			for (var i = 0; i < vm.form.claims.length; i++) {
				if (vm.form.claims[i].claimValue === permission) {
					vm.form.claims.splice(i, 1);
					existed = true;
				}
			}
			if (!existed) {
				vm.form.claims.push({ claimType: 'permission', claimValue: permission, userId: vm.form.id });
			}
		};

	}
})();