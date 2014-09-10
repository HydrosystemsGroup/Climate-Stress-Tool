var app = angular.module('CST', ['ngRoute']);

app.value('ocpuUrl', 'http://54.85.3.90/ocpu');

app.service('ocpuService', ['$http', 'ocpuUrl', function($http, url) {
  this.getData = function(sessionKey, format, cb) {
    $http.get(url+'/tmp/' + sessionKey + '/R/.val/' + format).
      success(function(data, status, headers, config) {
        console.log('getData: SUCCESS');
        cb(data);
      })
      .error(function(data, status, headers, config) {
        console.log('getData: ERROR');
        console.log(data);
      });
  };

  this.getMaurer = function(latitude, longitude, cb) {
    $http.post((url + '/library/weathergen/R/get_maurer_mon'), {lat: latitude, lon: longitude}).
      success(function(data, status, headers, config) {
        console.log('getMaurer: SUCCESS');
        cb(data, headers());
      }).
      error(function(data, status, headers, config) {
        console.log('getMaurer: ERROR');
        console.log(data);
      });
  };
}]);


app.controller('IndexCtrl', ['$scope', function($scope) { }]);

app.controller('WeatherCtrl', ['$scope', 'ocpuService', function($scope, ocpu) { 
  $scope.latitude = 42;
  $scope.longitude = -72;
  $scope.getDataset = function() {
    console.log('getDataset()');
    ocpu.getMaurer(+$scope.latitude, +$scope.longitude, function(data, headers) {
      $scope.key = headers['x-ocpu-session'];

      ocpu.getData($scope.key, 'json', function(data) {
        $scope.data = data;
        console.log('getDataset: DONE');  
      });
    });
  };
}]);


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/templates/index.html',
        controller: 'IndexCtrl'
      }).
      when('/weather', {
        templateUrl: 'app/templates/weather.html',
        controller: 'WeatherCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);