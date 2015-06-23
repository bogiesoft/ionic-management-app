angular.module('starter.sincronizarCtrl', ['LocalStorageModule']).controller('sincronizarCtrl', function($scope, $location, $http,  $interval, localStorageService) {

	var _clients = localStorageService.get('clients');
	var _bar = localStorageService.get('bar');
	var _cestas = localStorageService.get('cesta');

	$http.post('http://54.88.251.204/clients', {
		clients: _clients
	}).success(function(response, status, headers, config) {
		postBar()
	}).error(function(data, status, headers, config) {
		postBar()
	})

	function postBar() {
		$http.post('http://54.88.251.204/bar', {
			bar: _bar
		}).success(function(response, status) {
			postCesta()
		}).error(function(data, status, headers, config) {
			postCesta()
		})
	}

	function postCesta() {
		$http.post('http://54.88.251.204/cestas', {
			cesta: _cestas	
		}).success(function(response, status) {
			goBack()
		}).error(function(data, status, headers, config) {
			goBack()
		})
	}
	function goBack() {
		localStorageService.set('cesta', '')
		localStorageService.set('bar', '')
		localStorageService.set('clients', '')
		var terminal = $interval(function(){
			$interval.cancel(terminal);
			$location.path('/')
		}, 1000)
	}

})
