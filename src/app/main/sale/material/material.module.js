(function () {
	'use strict';

	angular
		.module('app.material',
		[

		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.material', {
				url: '/material',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/material/list/list.html',
						controller: 'MaterialController as vm'
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			}).state('app.material.create', {
				url: '/create',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/material/create/create.html',
						controller: 'MaterialCreateController as vm'
					}
				}
			}).state('app.material.edit', {
				url: '/edit/:id',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/material/edit/edit.html',
						controller: 'MaterialEditController as vm'
					}
				},
				resolve: {
					Item: function(apiResolver, $stateParams) {
                        return apiResolver.resolve('material@get', {id: $stateParams.id});
                    }
				}
			});

		msNavigationServiceProvider.saveItem('sale.material', {
			title: 'Danh sách nguyên liệu',
			icon: 'icon-basket-fill',
			state: 'app.material',
			weight: 3,
		});
	}

})();