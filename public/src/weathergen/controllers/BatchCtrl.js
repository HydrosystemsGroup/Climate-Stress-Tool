
angular.module('cst.weathergen')
  .controller('BatchCtrl', ['$scope', '$state',
    function($scope, $state) {
      console.log('BatchCtrl');
      $scope.controls = {
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
        mean_precip: {
          range: {
            min: 0.5,
            max: 2
          },
          step: 0.1,
          decimals: 1,
          minVal: 0.7,
          maxVal: 1.3
        },
        cv_precip: {
          range: {
            min: 0.5,
            max: 1.5
          },
          step: 0.1,
          decimals: 1,
          minVal: 1,
          maxVal: 1
        },
        mean_temp: {
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
        var variables = ['dry_spell', 'wet_spell', 'mean_precip', 'cv_precip', 'mean_temp'];

        var ranges = {};
        var n = $scope.controls.n_trial;
        variables.forEach(function(v) {
          ranges[v] = d3.range($scope.controls[v].minVal, $scope.controls[v].maxVal + 0.0001, $scope.controls[v].step);
          n = n * ranges[v].length;
          console.log(v, ranges[v]);
        });
        console.log('No. runs: ', n);
      };
    }
  ]);
