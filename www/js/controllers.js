var produtos = function(){
	return [
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
}


var CestaCompras = function() {
	return {
		client_id: "",
		assinatura:"",
		data: "",
		cesta: "",
	}
}

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
		barService.update(client)
		$location.path('/bar-client')
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
		cesta: {},
		
		update: function(client) {
			this.barClient = client;
		},

		updateProdutos: function(itemsCesta) {
			this.cesta = itemsCesta
		}
	}
})

.controller('barClientCtrl', function($scope, $location, barService, localStorageService) {

	var barClient = barService.barClient;
	$scope.client = barService.barClient;
	$scope.produtos = new produtos();
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
		
		var _basket = [];

		for(var i = 0; i < $scope.produtos.length; i++) {
			if($scope.produtos[i].qty > 0) {
				var _produto = $scope.produtos[i];
				_basket.push(_produto)
			}	
		}	

		var barClients = localStorageService.get('bar');
		
		/*for(var i = 0; i < barClient.produtos.length; i++) {
			if(barClient.produtos[i].title == basket[i].title) {
				barClient.produtos[i].qty += basket[i].qty;
			}	
		}*/	

		/*barClients.forEach(function(obj) {
			if(obj.nome == barClient.nome) {
				obj.produtos = barClient.produtos;
				localStorageService.set('bar', '')
				localStorageService.set('bar', barClients)
			}
		})*/


		barService.update(barClient)
		barService.updateProdutos(_basket)
		$location.path('/bar-assinatura-client')
	}

	$scope.resumoBar = function() {
		$location.path('/bar-resumo-client')
	}

})

.controller('barAssinaturaCtrl', function($scope, $state,  $ionicHistory, $location, barService, localStorageService) {
	
	var canvas = document.getElementById('signatureCanvas');
	var signaturePad = new SignaturePad(canvas);
    
	var barClient = barService.barClient
	var cesta = barService.cesta
	
	$scope.salvarCestaDeCompras = function() {
		var cestaCompras = new CestaCompras()
		
		cestaCompras.client_id= barClient.client_id;
		cestaCompras.assinatura= signaturePad.toDataURL(); 
		cestaCompras.cesta= cesta;
		cestaCompras.data= new Date()

		var cestaList = localStorageService.get('cesta') || []
	
		cestaList.push(cestaCompras)
		localStorageService.set('cesta', cestaList)
		$ionicHistory.goBack(-3);
	}

	$scope.clearCanvas = function() {
		signaturePad.clear();
	}
	    
})

.controller('barResumoClientCtrl', function($scope, $location, $ionicHistory, barService, localStorageService) {
	
	var total = 0;
	var cestaList = localStorageService.get('cesta')
	var cesta = []
	var cestaCombined = [];
	
	cestaList.forEach(function(data) {
		if(data.client_id == barService.barClient.client_id) {
			data.cesta.forEach(function(items) {
				cesta.push(items)
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
		
		for(var o in obj) {
			final.push(obj[o])
		}
		
	    return final
	}
		
	cestaCombined = reduce(cesta)

	cestaCombined.forEach(function(data) {
		total += data.qty * data.preco;
		data.preco = Number(data.preco).toFixed(2);
	})
	
	$scope.barClient = barService.barClient;
	$scope.total = Number(total).toFixed(2);
	$scope.produtos = cestaCombined;

	$scope.fazerPagamento = function() {
		var barClients = localStorageService.get('bar')
		var barClient;

		barClients.forEach(function(data) {
			if(data.client_id == barService.barClient.client_id) {
				data.pago = true;
				data.total = Number(total).toFixed(2);
				data.cesta = 
				localStorageService.set('bar', '');
				localStorageService.set('bar', barClients)
				$ionicHistory.goBack(-3)
			}
		})
	}
})

// Sincronizar Controller

.controller('sincronizarCtrl', function($scope, $location,  $interval, localStorageService) {
	localStorageService.set('clients', '');
	localStorageService.set('bar', '');
	localStorageService.set('cesta', '');
	var terminal = $interval(function(){
		$interval.cancel(terminal);
		$location.path('/')
	}, 1000)

})
