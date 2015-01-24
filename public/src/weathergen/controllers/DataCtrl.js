angular.module('weathergen')
  .controller('DataCtrl', ['$scope', '$filter', '$http', 'ocpuService', '$state', function($scope, $filter, $http, ocpu, $state) { 
    console.log('DataCtrl');
    $scope.loading = true;
    var latitude = +$scope.coordinate[1];
    var longitude = +$scope.coordinate[0];
    if (latitude !== null & isFinite(latitude) & longitude !== null & isFinite(longitude)) {
      $http.post('/api/maurer', {latitude: latitude, longitude: longitude})
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
  }]);