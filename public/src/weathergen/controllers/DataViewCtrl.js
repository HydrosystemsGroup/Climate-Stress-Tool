
angular.module('cst.weathergen')
  .controller('DataViewCtrl', ['$state', '$scope', 'messageCenterService', 'dataService',
    function($state, $scope, messageCenterService, dataService) {
      console.log('DataViewCtrl: load');

      $scope.variableLabels = {
        prcp: 'Precip (mm/day)',
        tmin: 'Min Temp (degC)',
        tmax: 'Max Temp (degC)',
        wind: 'Wind (m/s)'
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
    }
  ]);
