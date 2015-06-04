angular.module('starter.controllers', ['LocalStorageModule'])

.controller('menuCtrl', function($scope) {
	$scope.menu = [
		{title:'Check-in', id:1},
		{title:'Check-out', id:2},
		{title:'Histórico', id:3},
		{title:'Sincronizar', id:4},
		{title:'Logout', id:5}
	]
})

.controller('checkinCtrl', function($scope, $location, localStorageService) {
    var clients = localStorageService.get('clients') || []; 
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
                    checkoutConfirmado: false
            }
            $scope.checkinData = null;
	    $scope.checkinData = {};
	    clients.push(client);
            localStorageService.set(key, clients);
            $location.path('/Histórico')
    }
})

.controller('historyCtrl', function($scope, localStorageService) {
	$scope.histData = {}
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

.controller('checkoutCtrl', function($scope, localStorageService) {
	$scope.checkoutData = {};
    	$scope.clients = localStorageService.get('clients')
    	$scope.checkout = function(client) {
		var clientes = $scope.clients;
            		for(var i = 0; i < clientes.length; i++){
                    		if(clientes[i]['client_id'] == client.client_id) {
                            	clientes[i]['checkoutConfirmado'] = true;
                            	localStorageService.set('clients', '')
                            	localStorageService.set('clients', clientes);
                    	}
            	}
    	}
    	$scope.mainMenu = function() {
		$location.path('/home')
    	}
})

.controller('sincronizarCtrl', function($scope, $location,  $interval, localStorageService) {
	localStorageService.set('clients', '');
	var terminal = $interval(function(){
		$interval.cancel(terminal);
		$location.path('/')
	}, 1000)

})
