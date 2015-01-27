
angular.module('cst.weathergen')
  .controller('SimulateResultsCtrl', ['$scope', '$state', '$stateParams', '$http', '$interval', 'messageCenterService',
    function($scope, $state, $stateParams, $http, $interval, messageCenterService) { 
      console.log('SimulateResultsCtrl');

      if ($stateParams.id === '') {
        $state.go('weathergen.simulate.resultslist');
      }

      $scope.has_job = false;
      $scope.job = {};

      var refreshStatus = function() {
        $http.get('/api/wgen/' + $stateParams.id)
          .success(function(data, status, headers, config) {
            $scope.has_job = true;
            $scope.job = data;

            if (data.state === 'failed') {
              $interval.cancel(timer);
              messageCenterService.add('danger', 'Simulation failed');
            }

            if (data.state === 'complete') {
              $scope.plotResults($scope.job.id);
              $interval.cancel(timer);
              messageCenterService.add('success', 'Simulation finished');
            }
          });
      };

      refreshStatus();    
      var timer = $interval(refreshStatus, 1000);

      $scope.variableLabels = {
        prcp: 'Precip (mm/day)',
        tmin: 'Min Temp (degC)',
        tmax: 'Max Temp (degC)',
        temp: 'Mean Temp (degC)'
      };

      $scope.chart = {
        variable: 'prcp'
      };

      $scope.$watch('chart.variable', function(newVal, oldVal) {
        // disallow user to unselect all variables
        if (!newVal) {
          $scope.chart.variable = oldVal;
        }
      });

      $scope.plotResults = function(id) {
        d3.csv('/api/wgen/' + id + '/files/sim.csv', function(d) {
            return {
              date: new Date(d.DATE),
              prcp: +d.PRCP,
              tmin: +d.TMIN,
              tmax: +d.TMAX,
              temp: +d.TEMP
            };
          }, function(error, rows) {
            console.log(rows[1]);
            $scope.results = rows;
            $scope.$digest();
          });
      };
    }
  ]);
