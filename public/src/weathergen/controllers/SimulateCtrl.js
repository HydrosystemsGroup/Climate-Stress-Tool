
angular.module('weathergen')
  .controller('SimulateCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) { 
    console.log('SimulateCtrl');
    $scope.inputs = {
      n_year: 10
    };

    if ($scope.coordinate[1] === null | !isFinite($scope.coordinate[1]) | $scope.coordinate[0] === null | !isFinite($scope.coordinate[0])) {
      console.log('redirect');
      $state.go('weathergen');
    }

    $scope.run = function() {
      var latitude = +$scope.coordinate[1];
      var longitude = +$scope.coordinate[0];
      var n_year = +$scope.inputs.n_year;
    
      $http.post('/api/wgen', {
        latitude: latitude,
        longitude: longitude,
        n_year: n_year
      })
      .success(function(data, status, headers, config) {
        console.log(data);
        $state.go('weathergen.result', {id: data.id});
      })
      .error(function(data, status, headers, config) {
        console.log('ERROR');
      });          
    };

  }]);
