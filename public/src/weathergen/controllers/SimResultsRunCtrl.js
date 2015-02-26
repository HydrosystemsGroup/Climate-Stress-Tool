
angular.module('cst.weathergen')
  .controller('SimResultsRunCtrl', ['$scope', '$state', '$stateParams', '$http', '$interval', 'messageCenterService',
    function($scope, $state, $stateParams, $http, $interval, messageCenterService) {
      console.log('SimResultsRunCtrl');

      // $scope.variableLabels = {
      //   prcp: 'Precip (mm/day)',
      //   tmin: 'Min Temp (degC)',
      //   tmax: 'Max Temp (degC)',
      //   temp: 'Mean Temp (degC)'
      // };

      // $scope.chart = {
      //   variable: 'prcp'
      // };

      // $scope.$watch('chart.variable', function(newVal, oldVal) {
      //   // disallow user to unselect all variables
      //   if (!newVal) {
      //     $scope.chart.variable = oldVal;
      //   }
      // });

      // $scope.plotResults = function(id) {
      //   d3.csv('/api/wgen/' + id + '/files/sim.csv', function(d) {
      //       return {
      //         date: new Date(d.DATE),
      //         prcp: +d.PRCP,
      //         tmin: +d.TMIN,
      //         tmax: +d.TMAX,
      //         temp: +d.TEMP
      //       };
      //     }, function(error, rows) {
      //       $scope.$apply(function() {
      //         $scope.results = rows;
      //       });
      //     });
      // };

      // $scope.plotResults($scope.job.id);
    }
  ]);
