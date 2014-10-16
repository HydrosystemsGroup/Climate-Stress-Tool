
angular.module('weathergen')
  .controller('WeatherCtrl', ['$scope', '$filter', 'ocpuService', function($scope, $filter, ocpu) { 
    $scope.coordinate = [];
    $scope.features = {};
    $scope.loading = false;

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };

    $scope.session = null;
    
    $scope.getDataset = function() {
      console.log('getDataset()');
      $scope.loading = true;
      ocpu.getMaurerMon(+$scope.coordinate[1], +$scope.coordinate[0], function(data, headers) {
        $scope.session = headers['x-ocpu-session'];

        ocpu.aggregateMaurerMon($scope.session, function(data, headers) {
          var sessionAnnual = headers['x-ocpu-session'];
          $scope.session_yr = sessionAnnual;

          ocpu.getData(sessionAnnual, 'json', function(data) {
            $scope.loading = false;
            $scope.data_yr = data;
          });
        });

        ocpu.getData($scope.session, 'json', function(data) {
          $scope.data = [];
          angular.forEach(data, function(d, i) {
            d.DATE = new Date(d.DATE);
            this.push(d);
          }, $scope.data);
        });
      });
    };
  }]);
