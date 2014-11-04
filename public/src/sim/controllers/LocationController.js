
angular.module('sim')
  .controller('LocationCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.model.location.coordinate = [];
    $scope.features = {};

    $scope.clearCoordinate = function() {
      $scope.model.location.coordinate = [];
      $scope.features = {};
    };
  }]);
