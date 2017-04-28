(function () {
	'use strict';

	angular
		.module('app.table')
		.controller('TableCreateController', TableCreateController);

	/** @ngInject */
	function TableCreateController($state, $mdDialog, api, Rooms) {
		var vm = this;
		vm.form = {
			allowInventory: true,
			inventory: 0,
			roomId: 1,
			tableType: 2
		};
		vm.Rooms = Rooms.items;
		vm.types = [
			{id: 2, name: 'Bàn Cà phê'},
			{id: 3, name: 'Bàn Bi-da'}
		];
		
		
		vm.submit = function() {
			api.table.save(vm.form, function() {
				$state.go('app.table');
			});
		}

	}
})();