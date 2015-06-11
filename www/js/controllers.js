var produtos =	[
	{'title':'Refrigerante', 'qty':0, 'preco':2.50},
	{'title': 'Refrigerante 2 Litros', 'qty':0, 'preco': 8.00},
	{'title': 'Refrigerante 1.5 Litros', 'qty':0, 'preco': 7.00},
	{'title': 'Cerveja', 'qty':0, 'preco': 3.50},
	{'title': 'Suco', 'qty':0,'preco': 2.00},
	{'title': 'Água', 'qty':0,'preco':2.00},
	{'title': 'Água com gás', 'qty':0,'preco': 2.50},
	{'title': 'Picolé sabor fruta', 'qty':0,'preco': 2.00},
	{'title': 'Picolé sabor creme', 'qty':0,'preco': 3.50},
	{'title': 'Queijo quente', 'qty':0,'preco': 3.50},
	{'title': 'Misto quente', 'qty':0,'preco': 3.50},
	{'title': 'Kalzone', 'qty':0,'preco': 3.50},
	{'title': 'Chiclete', 'qty':0,'preco': 2.00},
	{'title': 'Chocolate', 'qty':0,'preco': 2.00},
	{'title': 'Sonho de valsa', 'qty':0,'preco': 1.20},
	{'title': 'Paçoca', 'qty':0,'preco': 1.00},
	{'title': 'Refeição', 'qty':0,'preco': 15.00},
	{'title': 'Café', 'qty':0,'preco': 2.00}
]

angular.module('starter.controllers', ['LocalStorageModule'])

.controller('menuCtrl', function($scope) {
	$scope.menu = [
		{title:'Check-in', id:1},
		{title:'Check-out', id:2},
		{title:'Bar', id:3},
		{title:'Histórico', id:4},
		{title:'Sincronizar', id:5},
		{title:'Logout', id:6}
	]
})

.controller('checkinCtrl', function($scope, $location, localStorageService) {
	var clients = localStorageService.get('clients') || []; 
	$scope.cabanas = [
		'Tucano',
		'Lagao',
		'Coruja'
	]

	$scope.checkinData = {};
    
	$scope.submit = function() {
		var key = 'clients';
		var client = {
			client_id: clients.length,
			nome: $scope.checkinData.nome,
			sexo: $scope.checkinData.sexo,
			cidade: $scope.checkinData.cidade,
			email: $scope.checkinData.email,
			checkin: $scope.checkinData.checkin,
			checkout: $scope.checkinData.checkout,
			cabana: $scope.checkinData.cabana,
			pessoas: $scope.checkinData.pessoas,
			diaria: $scope.checkinData.diaria,
			checkoutConfirmado: false
		}
		$scope.checkinData = null;
		$scope.checkinData = {};
		clients.push(client);
		localStorageService.set(key, clients);
		inserirBarClient(client)
		$location.path('/')
	}

	function inserirBarClient(client) {
		var newBarClient = {
			nome:client.nome,
			cabana:client.cabana,
			sexo: client.sexo,
			email: client.email,
			produtos:produtos,
			total: 0,
			pago: false
		}
		var barClients = localStorageService.get('bar') || []
		barClients.push(newBarClient)
		localStorageService.set('bar', barClients)	
	}	
})

.controller('historyCtrl', function($scope, localStorageService) {
	$scope.histData = {}
	$scope.clients = [];
	$scope.clients = localStorageService.get('clients')

	$scope.filtrar = function() {
		$scope.clients = localStorageService.get('clients')

		function convertDate(data) {
			var from = new Date(data);
			var to = new Date();
			to.setDate(from.getDate());
			to.setHours(0,0,0,0)
			return to.toString();
		}

		if($scope.histData.checkin && $scope.histData.checkout) {
			var clients = $scope.clients;
			$scope.clients = [];	
			clients.forEach(function(data){
				if($scope.histData.checkin == convertDate(data.checkin) 
					&& $scope.histData.checkout == convertDate(data.checkout)) 
				{
					$scope.clients.push(data)
				}
			})
		}

		if($scope.histData.checkin && !$scope.histData.checkout) {
			var clients = $scope.clients;
			$scope.clients = [];	
			clients.forEach(function(data){
				if($scope.histData.checkin == convertDate(data.checkin)) 
				{
					$scope.clients.push(data)
				}
			})
		}

		if($scope.histData.checkout && !$scope.histData.checkin) {
			var clients = $scope.clients;
			$scope.clients = [];	
			clients.forEach(function(data){
				if($scope.histData.checkout == convertDate(data.checkout)) 
				{
					$scope.clients.push(data)
				}
			})
		}
	}

	$scope.limparCampos = function() {
		$scope.clients = localStorageService.get('clients')
		$scope.histData.checkin = "";
		$scope.histData.checkout = "";
	}
})

.controller('checkoutCtrl', function($scope, $location, localStorageService, dataService) {
	$scope.checkoutData = {};
	$scope.clients = localStorageService.get('clients')
	$scope.checkout = function(client) {
		dataService.update(client)
		$location.path('/completar-checkout')
	}
	$scope.mainMenu = function() {
		$location.path('/home')
	}
})

.factory('dataService', function() {
	return {
		client: {},

		update: function(data) {
			this.client = data;
		}
	}
})

.controller('compCheckoutCtrl', function($scope, dataService, localStorageService) {
	$scope.client = dataService.client;

	function days_between(date1, date2) {
		var ONE_DAY = 1000 * 60 * 60 *24;
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();
		var difference_ms = Math.abs(date1_ms - date2_ms)
		return Math.round(difference_ms/ONE_DAY)	
	}

	$scope.diaria = dataService.client.diaria * days_between(new Date(dataService.client.checkin), new Date(dataService.client.checkout))

	var clients = localStorageService.get('clients')
	$scope.checkout = function(client) {
		var clientes = clients;
		for(var i = 0; i < clients.length; i++) {
			if(clientes[i]['client_id'] == client.client_id) {
				clientes[i]['checkoutConfirmado'] == true;
				localStorageService.set('clients',  '');
				localStorageService.set('clients', clientes)
			}
		}
	}
})

.controller('barCtrl', function($scope, $ionicModal, barService, $location, localStorageService) {
	$scope.clients = localStorageService.get('bar')
	
	$scope.go = function(client) {
		var barClients = localStorageService.get('bar');
		barClients.forEach(function(obj) {
			if(client.nome == obj.nome) {
				barService.update(obj)
				$location.path('/bar-client')
			}
		})
	}

	$scope.cabanas = [
		'Tucano',
		'Lagoa',
		'Coruja'
	]

	$scope.barData = {}
	
	$scope.inserirBarNovoClient = function() {
		var barClients = localStorageService.get('bar') || []
		barClients.push($scope.barData)
		localStorageService.set('bar', barClients)
		$scope.clients = barClients;
		$scope.closeModal();
	}

	$ionicModal.fromTemplateUrl('templates/bar-new-client.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	$scope.openModal = function() {
		$scope.modal.show();
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};
})

.factory('barService', function() {
	return {
		barClient: {},

		update: function(client) {
			this.barClient = client;
		}
	}
})

.controller('barClientCtrl', function($scope, $location, barService, localStorageService) {

	var barClient = barService.barClient;
	$scope.client = barService.barClient;
	$scope.produtos = produtos;
	$scope.subtotal = 0;
	$scope.produtos.forEach(function(data) {
		data.preco = Number(data.preco).toFixed(2);
	})

	$scope.voltar = function() {
		$scope.produtos.forEach(function(data){
			data.qty = 0;
		})
		$location.path('/Bar')
	}
	
	$scope.resetProdutosBar = function() {
		$scope.produtos.forEach(function(data){
			data.qty = 0;
		})
		$scope.subtotal = 0;
	}
	
	$scope.addItem = function(produto) {
		$scope.produtos.forEach(function(data) {
			if(data.title == produto.title) {
				data.qty += 1;
				$scope.subtotal = Number(parseFloat($scope.subtotal) + parseFloat(data.preco)).toFixed(2);
			}	
		})
	}

	$scope.salvarProdutosBar = function() {
		
		var basket = $scope.produtos;	
		var barClients = localStorageService.get('bar');
		
		for(var i = 0; i < barClient.produtos.length; i++) {
			if(barClient.produtos[i].title == basket[i].title) {
				barClient.produtos[i].qty += basket[i].qty;
			}	
		}	

		barClients.forEach(function(obj) {
			if(obj.nome == barClient.nome) {
				obj.produtos = barClient.produtos;
				localStorageService.set('bar', '')
				localStorageService.set('bar', barClients)
			}
		})

		$scope.resetProdutosBar();
		$scope.voltar();
		//TODO
		//print the receipt
	}

	$scope.resumoBar = function() {
		$location.path('/bar-resumo-client')
	}

})

.controller('barResumoClientCtrl', function($scope, $location, barService, localStorageService) {
	var total = 0;
	$scope.barClient = barService.barClient;
	$scope.barClient.produtos.forEach(function(data) {
		total += data.qty * data.preco;
		data.preco = Number(data.preco).toFixed(2);
	})
	$scope.total = Number(total).toFixed(2);
	$scope.produtos = $scope.barClient.produtos;

	$scope.fazerPagamento = function() {
		console.log("asd")
	}
})

.controller('sincronizarCtrl', function($scope, $location,  $interval, localStorageService) {
	localStorageService.set('clients', '');
	localStorageService.set('bar', '');
	var terminal = $interval(function(){
		$interval.cancel(terminal);
		$location.path('/')
	}, 1000)

})
