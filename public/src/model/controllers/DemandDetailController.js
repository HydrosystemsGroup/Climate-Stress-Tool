angular.module('model')
  .controller('DemandDetailCtrl', ['$scope', '$stateParams', '$state', '$window', 'ModelService', 'Graph', 
              function($scope, $stateParams, $state, $window, model, graph) {
    $scope.nodeId = $stateParams.nodeId;
    $scope.node = {
      name: '', 
      type: '',
      demands: []
    };
    
    $scope.graphCell = graph.getGraph().getCell($scope.nodeId);

    if (!$scope.graphCell) {
      $state.go('model');
    } else {
      $scope.node.name = $scope.graphCell.get('name');
      $scope.node.type = $scope.graphCell.get('nodeType');
      $scope.node.demands = $scope.graphCell.get('demands');
    }

    $scope.gridOptions = { 
      data: 'node.demands',
      enableSorting: false,
      enableCellEditOnFocus: true,
      enableColumnMenus: false,
      columnDefs: [
        {displayName: 'Month', field: 'month', enableCellEdit: false},
        {displayName: "Demand (MGD)", field: 'demand', enableCellEdit: true}
      ]
    };

    $scope.$watch('node.name', function(newName) {
      $scope.graphCell.set('name', newName);
      $scope.graphCell.attr('.label/text', newName);
    });

    $scope.$watch('node.demands', function(newDemands) {
      console.log('update node.demands', newDemands);
      $scope.graphCell.set('demands', newDemands);
    }, true);

    $scope.remove = function() {
      $scope.graphCell.remove();
      $state.go('model');
    };

  }]);