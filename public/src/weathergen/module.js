
var weathergen = angular.module('weathergen', ['ocpu']);

weathergen.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('weathergen', {
        url: '/weathergen',
        templateUrl: 'weathergen/templates/weather.html',
        controller: 'WeatherCtrl'
      })
      .state('weathergen.result', {
        url: '/:id',
        templateUrl: 'weathergen/templates/result.html',
        controller: 'ResultCtrl'
      })
      .state('weathergen.data', {
        url: '/weathergen/data',
        templateUrl: 'weathergen/templates/data.html',
        controller: 'DataCtrl'
      })
      .state('weathergen.simulate', {
        url: '/weathergen/simulate',
        templateUrl: 'weathergen/templates/simulate.html',
        controller: 'SimulateCtrl'
      });
  }]);