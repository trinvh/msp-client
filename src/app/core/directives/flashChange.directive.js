(function () {
	'use strict';

	angular
		.module('app.core')
		.directive('flashChange', flashChange);

	/** @ngInject */
	function flashChange($animate, $timeout) {
		return function (scope, element, attr) {
			scope.$watch(attr.flashChange, function (nv, ov) {
				if (nv !== ov) {
					var bgClass = nv < ov
						? 'change-down'
						: 'change-up';
					$animate.addClass(element, bgClass).then(function () {
						$timeout(function () { 
							$animate.removeClass(element, bgClass)
						}, 1000);
					});
				}
			});
		};
	}
})();