
angular.module('cst.weathergen')
  .controller('SimulateCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) { 
    console.log('SimulateCtrl');
    $scope.inputs = {
      n_year: 10,
      start_month: 10,
      start_water_year: 2000,
      dry_spell_changes: 1,
      wet_spell_changes: 1,
      prcp_mean_changes: 1,
      prcp_cv_changes: 1,
      temp_changes: 0,
    };

    if ($scope.coordinate[1] === null | !isFinite($scope.coordinate[1]) | $scope.coordinate[0] === null | !isFinite($scope.coordinate[0])) {
      // missing lat/lon, redirect back to weathgen home
      $state.go('weathergen');
    }

    $scope.run = function() {
      $http.post('/api/wgen', {
          latitude: +$scope.coordinate[1],
          longitude: +$scope.coordinate[0],
          n_year: +$scope.inputs.n_year,
          start_month: +$scope.inputs.start_month,
          start_water_year: +$scope.inputs.start_water_year,
          dry_spell_changes: +$scope.inputs.dry_spell_changes,
          wet_spell_changes: +$scope.inputs.wet_spell_changes,
          prcp_mean_changes: +$scope.inputs.prcp_mean_changes,
          prcp_cv_changes: +$scope.inputs.prcp_cv_changes,
          temp_changes: +$scope.inputs.temp_changes
        })
        .success(function(data, status, headers, config) {
          $state.go('weathergen.result', {id: data.id});
        })
        .error(function(data, status, headers, config) {
          console.log('ERROR');
        });          
    };

  }]);
