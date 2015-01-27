
angular.module('cst.weathergen')
  .controller('DataLocationCtrl', ['$scope', '$state', 
    function($scope, $state) { 
      console.log('DataLocationCtrl');
      
      $scope.coordinate = [];
      $scope.features = {};

      $scope.clearCoordinate = function() {
        $scope.coordinate = [];
        $scope.features = {};
      };      

      // var latitude = +$scope.coordinate[1];
      // var longitude = +$scope.coordinate[0];
      // if (latitude !== null & isFinite(latitude) & longitude !== null & isFinite(longitude)) {
      //   console.log('Fetching maurer data');
      //   $scope.loading = true;
      //   $http.post('/api/maurer', {latitude: latitude, longitude: longitude})
      //     .success(function(data, status, headers, config) {
      //       $scope.session = true;
      //       angular.forEach(data, function(d) {
      //         d.date = new Date(d.date);
      //       });
      //       $scope.data = data;
      //       $scope.loading = false;
      //     })
      //     .error(function(data, status, headers, config) {
      //       messageCenterService.add('danger', 'Error fetching historical climate data.');
      //       console.log('ERROR');
      //       $state.go('weathergen');
      //     });  
      // } else {
      //   console.log('Error fetching maurer data');
      //   messageCenterService.add('danger', 'Invalid latitude/longitude.');
      //   $state.go('weathergen');
      // }

    }
  ]);
