
var app = angular.module('climate-stress-tool', 
  ['ui.router',
   'templates',
   'home',
   'ocpu',
   'weathergen',
   'model',
   'charts',
   'map']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: 'home/templates/home.html'
      })
      .state('weather', {
        url: '/weather-generator',
        templateUrl: 'weathergen/templates/weather.html',
        controller: 'WeatherCtrl'
      })
      .state('model', {
        url: '/simulation-model',
        views: {
          '': {
            templateUrl: 'model/templates/model.html',
            controller: 'ModelCtrl'
          },
          'diagram@model': {
            templateUrl: 'model/templates/diagram.html',
            controller: 'DiagramCtrl'
          },
          'nodelist@model': {
            templateUrl: 'model/templates/node_list.html'
          }
        }
      })
      .state('model.node', {
        url: '/node/{nodeId}',
        templateUrl: 'model/templates/node_detail.html',
        controller: 'NodeDetailCtrl'
      })
      .state('map', {
        url: '/map',
        controller: 'MapCtrl',
        templateUrl: 'map/templates/map.html'
      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);
