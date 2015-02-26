
angular.module('cst.weathergen')
  .controller('DataMapCtrl', ['$state', 'messageCenterService', 'dataService',
    function($state, messageCenterService, dataService) {
      console.log('DataMapCtrl: load');
      var ctrl = this;
      this.fetching = false;
      this.data = dataService;

      this.clearCoordinate = function() {
        this.coordinate = {
          latitude: null,
          longitude: null
        };
        this.features = [];
      };
      this.clearCoordinate();

      this.fetchData = function() {
        this.fetching = true;
        dataService.getValuesByLocation(this.coordinate.latitude, this.coordinate.longitude)
          .then(function() {
            ctrl.fetching = false;
            messageCenterService.add('success', 'Historical data retrieved');
          }, function(error) {
            ctrl.fetching = false;
            console.log(error);
            messageCenterService.add('danger', 'Failed to get historical data: ' + error.data);
          });
      };

      if (dataService.hasData() && dataService.source === 'location') {
        this.coordinate.latitude = dataService.attrs.latitude;
        this.coordinate.longitude = dataService.attrs.longitude;
      }

      // $scope.fetching = false;

      // if ($scope.data.source === 'location' && $scope.data.attrs.coordinates) {
      //   $scope.map.coordinates[0] = $scope.data.attrs.coordinates[0];
      //   $scope.map.coordinates[1] = $scope.data.attrs.coordinates[1];
      // }

      // $scope.submitDataLocation = function() {
      //   console.log('submitDataLocation');

      //   var attrs = {
      //     coordinates: $scope.map.coordinates,
      //     features: $scope.map.features
      //   };

      //   fetchData(+$scope.map.coordinates[1], +$scope.map.coordinates[0], function(err, data) {
      //     $scope.fetching = false;
      //     if (err) {
      //       messageCenterService.add('danger', err.message);
      //     } else {
      //       $scope.submitData('location', attrs, data);
      //     }
      //   });
      // };

      // var validateCoordinates = function(latitude, longitude) {
      //   return latitude !== null & isFinite(latitude) & longitude !== null & isFinite(longitude);
      // };

      // var fetchData = function(latitude, longitude, cb) {
      //   console.log('fetchData', latitude, longitude);
      //   if (validateCoordinates(latitude, longitude)) {
      //     $scope.fetching = true;
      //     $http.get('/api/maurer', { params: {latitude: latitude, longitude: longitude}})
      //       .success(function(data, status, headers, config) {
      //         angular.forEach(data, function(d) {
      //           d.date = new Date(d.date);
      //         });
      //         cb(null, data);
      //       })
      //       .error(function(data, status, headers, config) {
      //         cb(new Error('Error fetching historical climate data.'));
      //       });
      //   } else {
      //     cb(new Error('Invalid latitude/longitude.'));
      //   }
      // };
    }
  ]);
