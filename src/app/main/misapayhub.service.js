(function () {
	'use strict';

	angular.module('app')
		.factory('MisapayHub', MisapayHub);

	/** @ngInject */
	function MisapayHub(Hub, $auth, CONFIG, $rootScope, $injector) {
		var _hub = new Hub('SaleHub', {
			listeners: {
				'OnMessage': function (message, extras) {
					$rootScope.$broadcast('OnMessage', message);
				},
				'OnNewOrder': function (connectionId, newOrder) {
					$rootScope.$broadcast('OnNewOrder', connectionId, newOrder);
				},
				'OnCancelOrder': function (connectionId, cancelledOrder) {
					$rootScope.$broadcast('OnCancelOrder', connectionId, cancelledOrder);
				},
				'OnOrderRemoved': function (removedOrder) {
					$rootScope.$broadcast('OnOrderRemoved', removedOrder);
				},
				'OnOrderPrinted': function (printedOrderIds) {
					$rootScope.$broadcast('OnOrderPrinted', printedOrderIds);
				},
				'OnOrderCheckout': function (table) {
					$rootScope.$broadcast('OnOrderCheckout', table);
				},
				'OnOrderChanged': function (changedOrder) {
					$rootScope.$broadcast('OnOrderChanged', changedOrder);
				},

				// Table events
				'OnNewTable': function (newTable) {
					$rootScope.$broadcast('OnNewTable', newTable);
				},
				'OnClientConnected': function (table) {
					$rootScope.$broadcast('OnClientConnected', table);
				},
				'OnClientDisconnected': function (table) {
					$rootScope.$broadcast('OnClientDisconnected', table);
				},
				'OnHardwareRefreshed': function(computerName, hardwares) {
					$rootScope.$broadcast('OnHardwareRefreshed', computerName, hardwares);
				}

			},
			methods: ['GetData', 'Order', 'OrderSingle', 'RemoveOrderItem', 'UpdateOrderItem', 'Checkout', 'RequestMonitorHardware'],
			logging: false,
			rootPath: CONFIG.SIGNALR_URL,
			transport: 'webSockets',
			autoConnect: false,
			queryParams: {
				'token': $auth.getToken()
			},
			errorHandler: function (error) {
				console.error('signalr error:', error);
				var $state = $injector.get('$state');
				$state.go('app.error');
			},
			stateChanged: function (state) {
				switch (state.newState) {
					case $.signalR.connectionState.connecting:
						break;
					case $.signalR.connectionState.connected:
						break;
					case $.signalR.connectionState.reconnecting:
						break;
					case $.signalR.connectionState.disconnected:
						break;
				}
			}
		});

		return _hub;
	}
})();