angular.module('starter.checkoutCtrl', ['LocalStorageModule']).controller('checkoutCtrl', function($scope, $location, localStorageService, dataService) {
	$scope.checkoutData = {};
	$scope.clients = localStorageService.get('clients')

	$scope.checkout = function(client) {
		dataService.update(client)
		$location.path('/completar-checkout')
	}
	$scope.mainMenu = function() {
		$location.path('/home')
	}
}).factory('dataService', function() {
	return {
		client: {},
		update: function(data) {
			this.client = data;
		}
	}
}).controller('compCheckoutCtrl', function($scope, $state, $location, dataService, localStorageService, $ionicHistory) {
	var barClients = localStorageService.get('bar')
	var barClient;
	var cestas = localStorageService.get('cesta')
	var cestaClient = [];

	barClients.forEach(function(data) {
		if(data.client_id == dataService.client.client_id) {
			barClient = data;	
		}
	})
	
	cestas.forEach(function(data) {
		if(data.client_id == dataService.client.client_id) {
			data.cesta.forEach(function(item){
				cestaClient.push(item)	
			})
		}
	})

	function reduce(array) {
		var obj = []
			var final = []
			array.forEach(function(data) {
				if(!obj[data.title]) {
					obj[data.title] = data;
				} else {
					if(obj[data.title].title == data.title) {
						obj[data.title].qty += data.qty
					}
				}
			})

		var valorTotal = 0;
		for(var o in obj) {
			valorTotal = Number(parseFloat(valorTotal) + parseFloat(obj[o].preco * obj[o].qty)).toFixed(2)
		}

		return valorTotal
	}

	if(!barClient.pago) {
		$scope.totalbar = reduce(cestaClient)
	} else {
		$scope.totalbar = 0
	}

	$scope.client = dataService.client;

	function days_between(date1, date2) {
		var ONE_DAY = 1000 * 60 * 60 *24;
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();
		var difference_ms = Math.abs(date1_ms - date2_ms)
		return Math.round(difference_ms/ONE_DAY)	
	}

	$scope.diaria = dataService.client.diaria * days_between(new Date(dataService.client.checkin), new Date(dataService.client.checkout)) * dataService.client.pessoas
$scope.totalHospegagem = Number(parseFloat($scope.diaria) + parseFloat($scope.totalbar)).toFixed(2)

	$scope.checkout = function(client) {
		var clients = localStorageService.get('clients')
			clients.forEach(function(data) {
				if(data.client_id == dataService.client.client_id) {
					data.checkoutConfirmado = true;
					localStorageService.set('clients',  '');
					localStorageService.set('clients', clients)
				}
			})


		barClients.forEach(function(data) {
			if(data.client_id == barClient.client_id) {
				data.pago = true;
				data.total = Number($scope.totalbar).toFixed(2);
				localStorageService.set('bar', '');
				localStorageService.set('bar', barClients)
			}
		})
		$ionicHistory.clearCache();
		$ionicHistory.goToHistoryRoot($ionicHistory.currentView().historyId)
	}


})


