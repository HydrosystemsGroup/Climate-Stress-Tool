
angular.module('cst.weathergen')
  .controller('SimulateResultsCtrl', ['$scope', '$state', '$stateParams', '$http', '$interval', 'messageCenterService',
    function($scope, $state, $stateParams, $http, $interval, messageCenterService) { 
      console.log('SimulateResultsCtrl');

      if ($stateParams.id === '') {
        $state.go('weathergen.simulate.jobs');
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
              $interval.cancel(timer);
              messageCenterService.add('success', 'Simulation finished');
              if (data.type === 'wgen') {
                $state.go('weathergen.simulate.results.wgen', {id: $stateParams.id});
              } else if (data.type === 'batch') {
                $state.go('weathergen.simulate.results.batch', {id: $stateParams.id});
              }
            }
          });
      };

      refreshStatus();
      var timer = $interval(refreshStatus, 3000);
    }
  ]);
