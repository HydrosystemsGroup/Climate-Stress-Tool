
angular.module('cst.weathergen')
  .controller('DataLocationCtrl', ['$scope', '$state', '$http', 'messageCenterService',
    function($scope, $state, $http, messageCenterService) { 
      console.log('DataLocationCtrl');
      
      $scope.map = {
        coordinates: [],
        features: {}
      };

      if ($scope.data.source === 'location' && $scope.data.attrs.coordinates) {
        $scope.map.coordinates[0] = $scope.data.attrs.coordinates[0];
        $scope.map.coordinates[1] = $scope.data.attrs.coordinates[1];
      }

      $scope.clearCoordinate = function() {
        console.log('clearCoordinate');
        $scope.map.coordinates = [];
        $scope.map.features = {};
      };

      $scope.submitDataLocation = function() {
        console.log('submitDataLocation');
        var attrs = {
          coordinates: $scope.map.coordinates,
          features: $scope.map.features
        };

        fetchData(+$scope.map.coordinates[1], +$scope.map.coordinates[0], function(err, data) {
          if (err) {
            messageCenterService.add('danger', err.message);
          } else {
            console.log(data);
            $scope.submitData('location', attrs, data);
          }
        });
      };

      var validateCoordinates = function(latitude, longitude) {
        return latitude !== null & isFinite(latitude) & longitude !== null & isFinite(longitude);
      };
      
      var fetchData = function(latitude, longitude, cb) {
        console.log('fetchData', latitude, longitude);
        if (validateCoordinates(latitude, longitude)) {
          console.log('Fetching data');
          $http.get('/api/maurer', { params: {latitude: latitude, longitude: longitude}})
            .success(function(data, status, headers, config) {
              angular.forEach(data, function(d) {
                d.date = new Date(d.date);
              });
              cb(null, data);
            })
            .error(function(data, status, headers, config) {
              cb(new Error('Error fetching historical climate data.'));
            });  
        } else {
          cb(new Error('Invalid latitude/longitude.'));
        }
      };
    }
  ]);
