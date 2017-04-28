(function () {
	'use strict';

	angular
		.module('app.table')
		.controller('TableEditController', TableEditController);

	/** @ngInject */
	function TableEditController($state, $mdDialog, api, Item, Rooms) {
		var vm = this;
		vm.form = Item;
		vm.Rooms = Rooms.items;
		vm.types = [
			{id: 2, name: 'Bàn Cà phê'},
			{id: 3, name: 'Bàn Bi-da'}
		];
		
		vm.submit = function() {
			api.table.update({id:vm.form.id}, vm.form, function() {
				$state.go('app.table');
			});
		}

	}
})();