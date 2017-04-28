(function () {
	'use strict';

	angular
		.module('app.room')
		.controller('RoomEditController', RoomEditController);

	/** @ngInject */
	function RoomEditController($state, $mdDialog, api, Item) {
		var vm = this;
		vm.form = Item;
		
		vm.submit = function() {
			api.room.update({id:vm.form.id}, vm.form, function() {
				$state.go('app.room');
			});
		}

	}
})();