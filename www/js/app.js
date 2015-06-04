// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'LocalStorageModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		
		.state('app', {
			url:'/',
			templateUrl: 'templates/menu.html',
			controller: 'menuCtrl'
		})

		.state('checkin', {
			url:'/Check-in',
			templateUrl:'templates/checkin.html',
			controller:'checkinCtrl'
		})

		.state('checkout', {
			url:'/Check-out',
			templateUrl:'templates/checkout.html',
			controller:'checkoutCtrl'
		})
		
		.state('history', {
			url:'/Histórico',
			templateUrl:'templates/history.html',
			controller:'historyCtrl'
		})
		
		.state('sincronizar', {
			url:'/Sincronizar',
			templateUrl:'templates/sincronizar.html',
			controller:'sincronizarCtrl'
		})		

	$urlRouterProvider.otherwise('/');

})
