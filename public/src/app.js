
var app = angular.module('climate-stress-tool', 
  ['ngRoute',
   'templates',
   'home',
   'ocpu',
   'weathergen',
   'model',
   'charts',
   'map']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'home/templates/home.html',
        controller: 'HomeCtrl'
      }).
      when('/weather', {
        templateUrl: 'weathergen/templates/weather.html',
        controller: 'WeatherCtrl'
      }).
      when('/model', {
        templateUrl: 'model/templates/model.html',
        controller: 'ModelCtrl'
      }).
      when('/map', {
        templateUrl: 'map/templates/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }]);
