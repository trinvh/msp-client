(function () {
	'use strict';

	angular
		.module('app.utilities.wallpaper')
		.controller('WallpaperController', WallpaperController);

	/** @ngInject */
	function WallpaperController($state, $mdDialog, $mdToast, Items, CONFIG, api) {
		var vm = this;
		vm.Items = Items;

		vm.form = {
			isDefault: true
		};

		vm.getImage = function (item) {
			return CONFIG.HOST_URL + '/' + item.image;
		};

		vm.imageChange = function($file, event, $flow) {
			if(['jpg', 'png', 'jpeg', 'gif'].indexOf($file.getExtension()) < 0) {
				$mdToast.show($mdToast.simple({
					textContent: 'Ảnh chỉ chấp nhận định đạng JPG, JPEG, PNG và GIF',
					position: 'bottom right'
				}));
				return false;
			}			
		};

		vm.upload = function () {
			var file = vm.flow.files.length ? vm.flow.files[0].file : null;
			if (file == null) {

			} else {
				api.wallpaper.save({
					wallpaper: vm.form,
					file: file
				}, function () {
					$state.reload();
				});
			}
		};

		vm.toggleDefault = function(item) {
			var itemToUpdate = angular.copy(item);
			itemToUpdate.isDefault = !itemToUpdate.isDefault;
			api.wallpaper.update({id:itemToUpdate.id}, itemToUpdate, function() {
				$state.reload();
			});
		};

		vm.destroy = function(item) {
			var confirm = $mdDialog.confirm()
				.title('Bạn thực sự muốn xóa?')
				.textContent('Thao tác xóa sẽ không hồi lại được')
				.ariaLabel('Lucky day')
				.ok('Chắc chắn xóa')
				.cancel('Bỏ qua');

			$mdDialog.show(confirm).then(function () {
				api.wallpaper.delete({id: item.id}, item, function () {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Xóa thành công!')
							.position('bottom right')
							.hideDelay(3000)
					);
					vm.Items.splice(vm.Items.indexOf(item), 1);
				});
			});
		};

	}
})();