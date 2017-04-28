(function () {
	'use strict';

	angular
		.module('app.room')
		.controller('RoomCreateController', RoomCreateController);

	/** @ngInject */
	function RoomCreateController($state, $mdDialog, api) {
		var vm = this;
		vm.form = {
			allowInventory: true,
			inventory: 0
		};
		
		vm.submit = function() {
			api.room.save(vm.form, function() {
				$state.go('app.room');
			});
		}

	}
})();