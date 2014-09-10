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

  this.getMaurerMon = function(latitude, longitude, cb) {
    $http.post((url + '/library/weathergen/R/get_maurer_mon'), 
               {lat: +latitude, lon: +longitude}).
      success(function(data, status, headers, config) {
        console.log('getMaurerMon: SUCCESS');
        cb(data, headers());
      }).
      error(function(data, status, headers, config) {
        console.log('getMaurerMon: ERROR');
        console.log(data);
      });
  };

  this.aggregateMaurerMon = function(sessionKey, cb) {
    console.log('aggregateMaurerMon:', sessionKey);
    $http({url: url + '/library/weathergen/R/aggregate_maurer_mon',
           method: 'POST',
           data: 'x='+sessionKey,
           headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).
      success(function(data, status, headers, config) {
        console.log('aggregateMaurerMon: SUCCESS');
        cb(data, headers());
      }).
      error(function(data, status, headers, config) {
        console.log('aggregateMaurerMon: ERROR');
        console.log(data);
      });
  };

}]);


app.controller('IndexCtrl', ['$scope', function($scope) { }]);

app.controller('WeatherCtrl', ['$scope', 'ocpuService', function($scope, ocpu) { 
  $scope.latitude = 42;
  $scope.longitude = -72;
  $scope.session = null;
  $scope.getDataset = function() {
    console.log('getDataset()');
    ocpu.getMaurerMon(+$scope.latitude, +$scope.longitude, function(data, headers) {
      $scope.session = headers['x-ocpu-session'];

      ocpu.aggregateMaurerMon($scope.session, function(data, headers) {
        var sessionAnnual = headers['x-ocpu-session'];
        $scope.session_yr = sessionAnnual;

        ocpu.getData(sessionAnnual, 'json', function(data) {
          $scope.data_yr = data;
        });
      });

      ocpu.getData($scope.session, 'json', function(data) {
        $scope.data = data;
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