
angular.module('cst.weathergen')
  .controller('SimBatchCtrl', ['$scope', '$state', 'messageCenterService', 'jobService', 'dataService',
    function($scope, $state, messageCenterService, jobService, dataService) {
      console.log('SimBatchCtrl: load');

      $scope.form = {
        n_trial: 1,
        n_year: 10,
        start_month: 10,
        start_water_year: 2000,
        dry_spell: {
          range: {
            min: 0.8,
            max: 1.2
          },
          step: 0.1,
          decimals: 1,
          minVal: 1,
          maxVal: 1
        },
        wet_spell: {
          range: {
            min: 0.8,
            max: 1.2
          },
          step: 0.1,
          decimals: 1,
          minVal: 1,
          maxVal: 1
        },
        prcp_mean: {
          range: {
            min: 0.5,
            max: 2
          },
          step: 0.1,
          decimals: 1,
          minVal: 0.7,
          maxVal: 1.3
        },
        prcp_cv: {
          range: {
            min: 0.5,
            max: 1.5
          },
          step: 0.1,
          decimals: 1,
          minVal: 1,
          maxVal: 1
        },
        temp_mean: {
          range: {
            min: -10,
            max: 10
          },
          step: 1,
          decimals: 0,
          minVal: -5,
          maxVal: 5
        }
      };

      $scope.run = function() {
        var variables = ['dry_spell', 'wet_spell', 'prcp_mean', 'prcp_cv', 'temp_mean'];

        var ranges = {};
        var n = $scope.form.n_trial;
        variables.forEach(function(v) {
          ranges[v] = d3.range($scope.form[v].minVal, $scope.form[v].maxVal + 0.0001, $scope.form[v].step);
          n = n * ranges[v].length;
          console.log(v, ranges[v]);
        });

        var inputs = {
          n_trial: +$scope.form.n_trial,
          n_year: +$scope.form.n_year,
          start_month: +$scope.form.start_month,
          start_water_year: +$scope.form.start_water_year,
          dry_spell_changes: ranges.dry_spell,
          wet_spell_changes: ranges.wet_spell,
          prcp_mean_changes: ranges.prcp_mean,
          prcp_cv_changes: ranges.prcp_cv,
          temp_mean_changes: ranges.temp_mean
        };

        jobService.postJob('batch', dataService.values, inputs)
          .then(function(response) {
            console.log('SimRunCtrl: run success', response.data);
            $state.go('weathergen.sim.job', {id: response.data.id});
          }, function(error) {
            console.log('SimRunCtrl: run fail', response.data);
            messageCenterService.add('danger', 'Error submitting simulation job');
          });
      };
    }
  ]);
