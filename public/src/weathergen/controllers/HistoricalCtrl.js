
angular.module('cst.weathergen')
  .controller('HistoricalCtrl', ['$scope', '$http', '$state', 'messageCenterService',
    function($scope, $http, $state, messageCenterService) { 
      console.log('HistoricalCtrl');

      if ($scope.data.values.length === 0) {
        messageCenterService.add('danger', 'Select a location or upload a file first',
                                 { status: messageCenterService.status.next });
        $state.go('weathergen.data');
      }

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
