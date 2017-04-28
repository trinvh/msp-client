(function () {
	'use strict';

	angular.module('app.inventory', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider, msNavigationServiceProvider) {
		$stateProvider
			.state('app.inventory', {
				url: '/inventory',
				abstract: true,
				data: {
                    permissions: {
                        only: ['CanImportGoods'],
                        redirectTo: 'app.login'
                    }
                }
			})
			.state('app.inventory.history', {
				url: '/history',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/inventory/history/history.html',
						controller: 'InventoryHistoryController as vm'
					}
				}
			})
			.state('app.inventory.ticket', {
				url: '/ticket',
				views: {
					'content@app': {
						templateUrl: 'app/main/sale/inventory/ticket/ticket.html',
						controller: 'InventoryTicketController as vm'
					}
				},
				resolve: {
					Data: function (apiResolver) {
						return apiResolver.resolve('inventory@get');
					}
				}
			});

		msNavigationServiceProvider.saveItem('sale.inventory', {
			title: 'Quản lý kho',
			icon: 'icon-indent',
			weight: 4,
		});

		msNavigationServiceProvider.saveItem('sale.inventory.history', {
			title: 'Lịch sử kiểm kho',
			weight: 1,
			state: 'app.inventory.history'
		});

		msNavigationServiceProvider.saveItem('sale.inventory.ticket', {
			title: 'Tạo phiếu kiểm kho',
			weight: 2,
			state: 'app.inventory.ticket'
		});
	}

})();