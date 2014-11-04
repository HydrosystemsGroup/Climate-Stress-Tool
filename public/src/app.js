
var app = angular.module('climate-stress-tool', 
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
      .state('weather', {
        url: '/weather-generator',
        templateUrl: 'weathergen/templates/weather.html',
        controller: 'WeatherCtrl'
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
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
);
