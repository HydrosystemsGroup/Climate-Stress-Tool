
var app = angular.module('cst.sim', []);

app.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('sim', {
        url: '/sim',
        abstract: true,
        templateUrl: 'sim/templates/sim.html',
        controller: 'SimCtrl'
      })
      .state('sim.home', {
        url: '/home',
        templateUrl: 'sim/templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('sim.location', {
        url: '/location',
        templateUrl: 'sim/templates/location.html',
        controller: 'LocationCtrl'
      })
      .state('sim.flow', {
        url: '/flow',
        templateUrl: 'sim/templates/flow.html',
        controller: 'FlowCtrl'
      })
      .state('sim.system', {
        url: '/system',
        templateUrl: 'sim/templates/system.html',
        controller: 'SystemCtrl'
      });
}]);
