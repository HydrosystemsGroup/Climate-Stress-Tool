
var app = angular.module('cst.weathergen', ['MessageCenterModule']);

app.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('weathergen', {
        url: '/weathergen',
        templateUrl: 'weathergen/templates/weathergen.html',
        controller: 'WeatherCtrl'
      })
      .state('weathergen.data', {
        url: '/data',
        templateUrl: 'weathergen/templates/data.html',
        controller: 'DataCtrl'
      })
      .state('weathergen.data.location', {
        url: '/location',
        templateUrl: 'weathergen/templates/data-location.html',
        controller: 'DataLocationCtrl'
      })
      .state('weathergen.data.upload', {
        url: '/upload',
        templateUrl: 'weathergen/templates/data-upload.html',
        controller: 'DataUploadCtrl'
      })
      .state('weathergen.historical', {
        url: '/historical',
        templateUrl: 'weathergen/templates/historical.html',
        controller: 'HistoricalCtrl'
      })
      .state('weathergen.simulate', {
        url: '/simulate',
        templateUrl: 'weathergen/templates/simulate.html',
        controller: 'SimulateCtrl',
      })
      .state('weathergen.simulate.setup', {
        url: '/setup',
        templateUrl: 'weathergen/templates/simulate-setup.html',
        controller: 'SimulateSetupCtrl'
      })
      .state('weathergen.simulate.resultslist', {
        url: '/results',
        templateUrl: 'weathergen/templates/simulate-results-list.html',
        controller: 'SimulateResultsListCtrl'
      })
      .state('weathergen.simulate.results', {
        url: '/results/:id',
        templateUrl: 'weathergen/templates/simulate-results.html',
        controller: 'SimulateResultsCtrl'
      });
  }]);