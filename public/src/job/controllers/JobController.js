
angular.module('job')
  .controller('JobCtrl', ['$scope', '$stateParams', '$http', '$interval', function($scope, $stateParams, $http, $interval) { 
    $scope.count = 0;
    $scope.has_job = false;
    $scope.job = {};
    $scope.results = [];
    // (function tick() {
    //     $scope.job = $http.get('/api/jobs/' + $stateParams.id)
    //       .success(function() {
    //         $scope.count += 1;
    //         $interval(tick, 1000);
    //     });
    // })();

    var timer = $interval(function() {
      $http.get('/api/jobs/' + $stateParams.id)
        .success(function(data, status, headers, config) {
          // console.log(data);
          $scope.has_job = true;
          $scope.count += 1;
          $scope.job = data;
          if (data.state === 'complete' || data.state === 'failed') {
            $interval.cancel(timer);
          }
        });
    }, 5000);
    $scope.show_results = false;
    $scope.plotResults = function(id) {
      d3.csv('/api/jobs/' + id + '/results', function(d) {
          return {
            DATE: new Date(d.DATE),
            PRCP: +d.PRCP,
            TMIN: +d.TMIN,
            TMAX: +d.TMAX,
            TEMP: +d.TEMP
          };
        }, function(error, rows) {
          $scope.results = rows.slice(0, 365);
          $scope.show_results = true;
          console.log($scope.results.length);
          $scope.$digest();
        });
    };

    // $http.get('/api/jobs/' + $stateParams.id)
    //   .success(function(data, status, headers, config) {
    //     console.log(data);
    //     $scope.job = data;
    //   })
    //   .error(function(data, status, headers, config) {
    //     console.log("ERROR");
    //     console.log(arguments);
    //   });
  }]);
