(function() {
	'use strict';

	angular.module('app')
		.factory('RemoteConfig', RemoteConfig);

	/** @ngInject */
	function RemoteConfig(api, apiResolver, $q) {
		var vm = this;
		vm.infos = {};

		vm.resolver = function() {
			var deferred = $q.defer();
			api.info.get(function(data) {
				vm.infos = data;
				return deferred.resolve(vm.infos);
			}, function(err) {
				return deferred.resolve(vm.infos);
			});
			return deferred.promise;
		};

		return vm;

	}
})();