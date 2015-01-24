
angular.module('weathergen')
  .controller('WeatherCtrl', ['$scope', '$filter', '$http', 'ocpuService', '$state', function($scope, $filter, $http, ocpu, $state) { 
    console.log('WeatherCtrl');
    $scope.coordinate = [];
    $scope.features = {};

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };

  }]);
