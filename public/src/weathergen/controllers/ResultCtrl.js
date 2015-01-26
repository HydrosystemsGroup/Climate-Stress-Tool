
angular.module('cst.weathergen')
  .controller('ResultCtrl', ['$scope', '$stateParams', '$http', '$interval', function($scope, $stateParams, $http, $interval) { 
    console.log('ResultCtrl');
    $scope.has_job = false;
    $scope.job = {};
    $scope.results = [];

    var refreshStatus = function() {
      $http.get('/api/wgen/' + $stateParams.id)
        .success(function(data, status, headers, config) {
          $scope.has_job = true;
          $scope.job = data;
          $scope.coordinate[0] = $scope.job.data.inputs.longitude;
          $scope.coordinate[1] = $scope.job.data.inputs.latitude;

          if (data.state === 'complete' || data.state === 'failed') {
            $interval.cancel(timer);
          }

          if (data.state === 'complete') {
            $scope.plotResults($scope.job.id);
          }
        });
    };

    refreshStatus();    
    var timer = $interval(refreshStatus, 1000);

    $scope.plotResults = function(id) {
      d3.csv('/api/wgen/' + id + '/files/sim.csv', function(d) {
          return {
            DATE: new Date(d.DATE),
            PRCP: +d.PRCP,
            TMIN: +d.TMIN,
            TMAX: +d.TMAX,
            TEMP: +d.TEMP
          };
        }, function(error, rows) {
          $scope.results = rows;
          $scope.$digest();
        });
    };
  }]);
