
var app = angular.module('model', []);

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
      });
}]);
