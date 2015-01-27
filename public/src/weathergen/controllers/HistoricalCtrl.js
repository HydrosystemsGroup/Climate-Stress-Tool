
angular.module('cst.weathergen')
  .controller('HistoricalCtrl', ['$scope', '$http', '$state', 'messageCenterService',
    function($scope, $http, $state, messageCenterService) { 
      console.log('HistoricalCtrl');

      $scope.variableLabels = {
        prcp: 'Precip (mm/day)',
        tmin: 'Min Temp (degC)',
        tmax: 'Max Temp (degC)',
        wind: 'Wind (m/s)'
      };

      $scope.chart = {
        variable: 'prcp'
      };

    }
  ]);
