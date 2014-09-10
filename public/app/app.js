var app = angular.module('CST', ['ngRoute']);

app.controller('IndexCtrl', ['$scope', function($scope) { }]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/templates/index.html',
        controller: 'IndexCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);