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

var CheckinClient = function() {
	return {
		client_id: "", 
		nome: "",
		sexo: "",
		cidade:"",
		email: "",
		checkin:"",
		checkout:"",
		cabana: "",
		pessoas: 0,
		diaria: 0,
		checkoutConfirmado: false
	}
}

var BarClient = function(){
	return {
		client_id: "",
		nome: "",
		cabana: "",
		sexo: "",
		email: "",
		cesta:[],
		total: 0,
		pago: false
	}
}

angular.module('starter.checkinCtrl', ['LocalStorageModule']).controller('checkinCtrl', function($scope, $location, localStorageService) {
	var clients = localStorageService.get('clients') || []; 
	$scope.cabanas = [
		'Tucano',
		'Lagao',
		'Coruja'
	]

	$scope.checkinData = {};
    
	$scope.submit = function() {
		var key = 'clients';
		var client = new CheckinClient()
		
		client.client_id= $scope.checkinData.nome + new Date().getUTCMilliseconds();
		client.nome= $scope.checkinData.nome;
		client.sexo= $scope.checkinData.sexo;
		client.cidade= $scope.checkinData.cidade;
		client.email= $scope.checkinData.email;
		client.checkin= $scope.checkinData.checkin;
		client.checkout= $scope.checkinData.checkout;
		client.cabana= $scope.checkinData.cabana;
		client.pessoas= $scope.checkinData.pessoas;
		client.diaria= $scope.checkinData.diaria;
		checkoutConfirmado= false;
		
		$scope.checkinData = null;
		$scope.checkinData = {};
		clients.push(client);
		localStorageService.set(key, clients);
		inserirBarClient(client)
		$location.path('/')
	}

	function inserirBarClient(client) {
		var barClient = new BarClient();
		barClient.client_id= client.client_id,
		barClient.nome= client.nome,
		barClient.cabana= client.cabana,
		barClient.sexo= client.sexo,
		barClient.email= client.email,
		barClient.produtos= [],
		barClient.total= 0,
		barClient.pago= false
		
		var barClients = localStorageService.get('bar') || []
		barClients.push(barClient)
		localStorageService.set('bar', barClients)
	}	
})
