
angular.module('cst.map')
  .controller('MapCtrl', ['$scope', function($scope) {
    $scope.coordinate = [];
    $scope.features = {};

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };
  }]);
