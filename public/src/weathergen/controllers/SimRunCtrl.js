
angular.module('cst.weathergen')
  .controller('SimRunCtrl', ['$scope', '$http', '$state', 'messageCenterService', 'dataService', 'jobService',
    function($scope, $http, $state, messageCenterService, dataService, jobService) {
      console.log('SimRunCtrl: load');

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

      $scope.run = function() {
        var inputs = {
          n_year: +$scope.inputs.n_year,
          start_month: +$scope.inputs.start_month,
          start_water_year: +$scope.inputs.start_water_year,
          dry_spell_changes: +$scope.inputs.dry_spell_changes,
          wet_spell_changes: +$scope.inputs.wet_spell_changes,
          prcp_mean_changes: +$scope.inputs.prcp_mean_changes,
          prcp_cv_changes: +$scope.inputs.prcp_cv_changes,
          temp_changes: +$scope.inputs.temp_changes
        };

        jobService.postJob('run', dataService.values, inputs)
          .then(function(response) {
            // messageCenterService.add('success', 'Job submitted succesfully');
            console.log('SimRunCtrl: run success', response.data);
            $state.go('weathergen.sim.job', {id: response.data.id});
          }, function(error) {
            console.log('SimRunCtrl: run fail', response.data);
            messageCenterService.add('danger', 'Error submitting simulation job');
          });
      };
  }]);
