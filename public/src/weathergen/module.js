
var app = angular.module('cst.weathergen', ['MessageCenterModule']);

app.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('weathergen', {
        url: '/weathergen',
        templateUrl: 'weathergen/templates/weathergen.html',
        controller: 'WeatherCtrl',
        controllerAs: 'wgen'
      })
      .state('weathergen.data', {
        url: '/data',
        templateUrl: 'weathergen/templates/data.html',
        controller: 'DataCtrl',
        controllerAs: 'data'
      })
      .state('weathergen.data.map', {
        url: '/map',
        templateUrl: 'weathergen/templates/data-map.html',
        controller: 'DataMapCtrl',
        controllerAs: 'map'
      })
      .state('weathergen.data.file', {
        url: '/file',
        templateUrl: 'weathergen/templates/data-file.html'
      })
      .state('weathergen.data.view', {
        url: '/view',
        templateUrl: 'weathergen/templates/data-view.html',
        controller: 'DataViewCtrl'
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
      .state('weathergen.simulate.batch', {
        url: '/batch',
        templateUrl: 'weathergen/templates/simulate-batch.html',
        controller: 'SimulateBatchCtrl'
      })
      .state('weathergen.simulate.jobs', {
        url: '/jobs',
        templateUrl: 'weathergen/templates/simulate-jobs.html',
        controller: 'SimulateJobsCtrl'
      })
      .state('weathergen.simulate.results', {
        url: '/results/:id',
        templateUrl: 'weathergen/templates/simulate-results.html',
        controller: 'SimulateResultsCtrl'
      })
      .state('weathergen.simulate.results.wgen', {
        url: '/wgen',
        templateUrl: 'weathergen/templates/simulate-results-wgen.html',
        controller: 'SimulateResultsWgenCtrl'
      })
      .state('weathergen.simulate.results.batch', {
        url: '/batch',
        templateUrl: 'weathergen/templates/simulate-results-batch.html',
        controller: 'SimulateResultsBatchCtrl'
      });
  }]);