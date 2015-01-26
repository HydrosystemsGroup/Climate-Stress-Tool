
var app = angular.module('cst', 
  ['ui.router',
   'ui.grid',
   'ui.grid.edit',
   'ui.grid.cellNav',
   'angularFileUpload',
   'templates',
   'home',
   'ocpu',
   'weathergen',
   'model',
   'charts',
   'map',
   'sim']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'HomeCtrl',
        templateUrl: 'home/templates/home.html'
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
  }])
  .run(
    [ '$rootScope', '$state', '$stateParams',
      function ($rootScope, $state, $stateParams) {
        // for debugging
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  );
