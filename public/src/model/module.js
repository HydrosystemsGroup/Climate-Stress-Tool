
var app = angular.module('cst.model', []);

app.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('model', {
        url: '/simulation-model',
        views: {
          '': {
            templateUrl: 'model/templates/model.html',
            controller: 'ModelCtrl'
          },
          'nodelist@model': {
            templateUrl: 'model/templates/node_list.html'
          }
        }
      })
      .state('model.reservoir', {
        url: '/reservoir/{nodeId}',
        templateUrl: 'model/templates/reservoir_detail.html',
        controller: 'ReservoirDetailCtrl'
      })
      .state('model.demand', {
        url: '/demand/{nodeId}',
        templateUrl: 'model/templates/demand_detail.html',
        controller: 'DemandDetailCtrl'
      })
      .state('model.inflow', {
        url: '/inflow/{nodeId}',
        templateUrl: 'model/templates/inflow_detail.html',
        controller: 'InflowDetailCtrl'
      });
  }]);
