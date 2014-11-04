
angular.module('sim')
  .controller('LocationCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.features = {};
    if ($scope.model.location && $scope.model.location.coordinates) {
      $scope.coordinates = $scope.model.location.coordinates;
    } else {
      $scope.coordinates = [];
    }

    $scope.clearCoordinate = function() {
      $scope.coordinates = [];
      $scope.features = {};
      $scope.model.location = null;
    };

    $scope.saveLocation = function() {
      if (!$scope.model.location) {
        $scope.model.location = {};
      }
      $scope.model.location.coordinates = $scope.coordinates;
    };
  }]);
