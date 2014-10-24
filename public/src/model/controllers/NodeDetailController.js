angular.module('model')
  .controller('NodeDetailCtrl', ['$scope', '$stateParams', '$state', '$window', 'ModelService', function($scope, $stateParams, $state, $window, model) {
    $scope.nodeId = $stateParams.nodeId;
    $scope.node = {name: '', type: ''};
    $scope.cell = model.getCell($scope.nodeId);
    
    if (!$scope.cell) {
      $state.go('model');
    } else {
      $scope.node.name = $scope.cell.get('name');
      $scope.node.type = $scope.cell.get('nodeType');
      $window.cell = $scope.cell;
    }

    $scope.$watch('node.name', function(newName) {
      $scope.cell.set('name', newName);
      $scope.cell.attr('.label/text', newName);
    });
  }]);