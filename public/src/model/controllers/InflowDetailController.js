angular.module('model')
  .controller('InflowDetailCtrl', ['$scope', '$stateParams', '$state', '$window', 'ModelService', 'Graph', 
              function($scope, $stateParams, $state, $window, model, graph) {
    $scope.nodeId = $stateParams.nodeId;
    $scope.node = {name: '', type: ''};
    $scope.cell = graph.getGraph().getCell($scope.nodeId);
    
    if (!$scope.cell) {
      $state.go('model');
    } else {
      $scope.node.name = $scope.cell.get('name');
      $scope.node.type = $scope.cell.get('nodeType');
    }

    $scope.$watch('node.name', function(newName) {
      $scope.cell.set('name', newName);
      $scope.cell.attr('.label/text', newName);
    });

    $scope.remove = function() {
      $scope.cell.remove();
      $state.go('model');
    };
  }]);