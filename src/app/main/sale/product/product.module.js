(function () {
	'use strict';

	angular
		.module('app.product',
		[
			'flow'
		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.product', {
				url: '/product',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/product/list/list.html',
						controller: 'ProductController as vm'
					}
				},
				resolve: {
					PRINTERS: function(apiResolver) {
						return apiResolver.resolve('printer@get');
					},
					Categories: function(apiResolver) {
						return apiResolver.resolve('category@get');
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			}).state('app.product.create', {
				url: '/create',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/product/create/create.html',
						controller: 'ProductCreateController as vm'
					}
				},
				resolve: {
					Categories: function(apiResolver) {
						return apiResolver.resolve('category@get');
					},
					Printers: function(apiResolver) {
						return apiResolver.resolve('printer@get');
					},
					Materials: function(apiResolver) {
						return apiResolver.resolve('material@get');
					}
				}
			}).state('app.product.edit', {
				url: '/edit/:id',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/product/edit/edit.html',
						controller: 'ProductEditController as vm'
					}
				},
				resolve: {
					Item: function(apiResolver, $stateParams) {
                        return apiResolver.resolve('product@get', {id: $stateParams.id});
                    },
					Categories: function(apiResolver) {
						return apiResolver.resolve('category@get');
					},
					Printers: function(apiResolver) {
						return apiResolver.resolve('printer@get');
					},
					Materials: function(apiResolver) {
						return apiResolver.resolve('material@get');
					}
				}
			});

		msNavigationServiceProvider.saveItem('sale.product', {
			title: 'Quản lý mặt hàng',
			icon: 'icon-basket',
			state: 'app.product',
			weight: 1,
		});
	}

})();