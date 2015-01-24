
angular.module('weathergen')
  .controller('WeatherCtrl', ['$scope', '$filter', '$http', 'ocpuService', '$state', function($scope, $filter, $http, ocpu, $state) { 
    $scope.coordinate = [];
    $scope.features = {};
    $scope.loading = false;

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };

    $scope.session = null;
    
    $scope.getDataset = function() {
      console.log('getDataset()');
      $scope.loading = true;
      ocpu.getMaurerMon(+$scope.coordinate[1], +$scope.coordinate[0], function(data, headers) {
        $scope.session = headers['x-ocpu-session'];

        ocpu.aggregateMaurerMon($scope.session, function(data, headers) {
          var sessionAnnual = headers['x-ocpu-session'];
          $scope.session_yr = sessionAnnual;

          ocpu.getData(sessionAnnual, 'json', function(data) {
            $scope.loading = false;
            $scope.data_yr = data;
          });
        });

        ocpu.getData($scope.session, 'json', function(data) {
          $scope.data = [];
          angular.forEach(data, function(d, i) {
            d.DATE = new Date(d.DATE);
            this.push(d);
          }, $scope.data);
        });
      });
    };

    $scope.getDatasetFromDB = function() {
      $scope.loading = true;
      var latitude = +$scope.coordinate[1];
      var longitude = +$scope.coordinate[0];
      if (latitude !== null & isFinite(latitude) & longitude !== null & isFinite(longitude)) {
        $http.post('/api', {latitude: latitude, longitude: longitude})
          .success(function(data, status, headers, config) {
            $scope.session = true;
            angular.forEach(data, function(d) {
              d.date = new Date(d.date);
            });
            $scope.data = data;
            $scope.loading = false;
          })
          .error(function(data, status, headers, config) {
            console.log('ERROR');
          });  
      }
    };

    $scope.runSimulation = function() {
      var latitude = +$scope.coordinate[1];
      var longitude = +$scope.coordinate[0];
      $http.post('/api/wgen', {
        latitude: latitude,
        longitude: longitude
      })
        .success(function(data, status, headers, config) {
          console.log(data);
          $state.go('job', {id: data.id});
        })
        .error(function(data, status, headers, config) {
          console.log('ERROR');
        });  
    };
  }]);
