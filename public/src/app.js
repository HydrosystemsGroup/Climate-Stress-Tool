
var app = angular.module('cst',
  ['ui.router',
   'ui.grid',
   'ui.grid.edit',
   'ui.grid.cellNav',
   'ui.bootstrap',
   'ui-rangeSlider',
   'angularFileUpload',
   'MessageCenterModule',
   'cst.templates',
   'cst.home',
   'cst.weathergen',
   'cst.charts',
   'cst.sim',
   'cst.model',
   'cst.map']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/templates/home.html'
      })
      .state('map', {
        url: '/map',
        controller: 'MapCtrl',
        controllerAs: 'map',
        templateUrl: 'map/templates/map.html'
      });

    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
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
