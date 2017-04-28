(function () {
	'use strict';

	angular
		.module('app.category',
		[

		]).config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		// State
		$stateProvider
			.state('app.category', {
				url: '/category',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/category/list/list.html',
						controller: 'CategoryController as vm'
					}
				},
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.login'
                    }
                }
			}).state('app.category.create', {
				url: '/create',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/category/create/create.html',
						controller: 'CategoryCreateController as vm'
					}
				}
			}).state('app.category.edit', {
				url: '/edit/:id',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/category/edit/edit.html',
						controller: 'CategoryEditController as vm'
					}
				},
				resolve: {
					Item: function(apiResolver, $stateParams) {
                        return apiResolver.resolve('category@get', {id: $stateParams.id});
                    }
				}
			});

		
		msNavigationServiceProvider.saveItem('sale.category', {
			title: 'Thể loại',
			icon: 'icon-format-list-bulleted',
			state: 'app.category',
			weight: 1,
		});
	}

})();