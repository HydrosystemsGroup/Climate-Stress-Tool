
angular.module('cst.weathergen')
  .controller('SimJobCtrl', ['$scope', '$state', '$stateParams', 'messageCenterService', 'jobService', 'job',
    function($scope, $state, $stateParams, messageCenterService, jobService, job) {
      console.log('SimJobCtrl: load');

      var ctrl = this;
      ctrl.job = job.data;
      ctrl.complete = false;

      $scope.chart = {
        variable: 'prcp',
        labels: {
          prcp: 'Precip (mm/day)',
          tmin: 'Min Temp (degC)',
          tmax: 'Max Temp (degC)',
          temp: 'Mean Temp (degC)'
        },
        data: []
      };

      $scope.$watch('chart.variable', function(newVal, oldVal) {
        // disallow user to unselect all variables
        if (!newVal) {
          $scope.chart.variable = oldVal;
        }
      });

      var fetchOutput = function() {
        if (ctrl.job.type === 'wgen' && ctrl.job.state === 'complete') {
          jobService.getRunOutput(ctrl.job.id)
            .then(function(data) {
              // angular.copy(data, $scope.chart.data);
              $scope.chart.data = data;
            }, function(error) {
              console.log(error);
              messageCenterService.add('danger', 'Error getting output');
            });
        }
      };

      if (ctrl.job.state !== 'failed' && ctrl.job.state !== 'complete') {
        jobService.pollJob($stateParams.id)
          .then(function (job) {
            // console.log('SimJobCtrl: pollJob resolve', job);
            ctrl.job = job;
            ctrl.complete = true;
            fetchOutput();
          }, function (error) {
            console.log('SimJobCtrl: pollJob rejected', error);
            messageCenterService.add('danger', 'Error getting job');
          }, function (job) {
            // console.log('SimJobCtrl: pollJob notify', job);
            ctrl.job = job;
          });
      } else {
        ctrl.complete = true;
        fetchOutput();
      }
    }
  ]);
