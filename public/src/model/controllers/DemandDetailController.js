angular.module('model')
  .controller('DemandDetailCtrl', ['$scope', '$stateParams', '$state', '$window', 'ModelService', 'Graph', 
              function($scope, $stateParams, $state, $window, model, graph) {
    $scope.nodeId = $stateParams.nodeId;
    $scope.node = {
      name: '', 
      type: '',
      demands: [{month: 1, demand: 0},
               {month: 2, demand: 0},
               {month: 3, demand: 0},
               {month: 4, demand: 0},
               {month: 5, demand: 0},
               {month: 6, demand: 0},
               {month: 7, demand: 0},
               {month: 8, demand: 0},
               {month: 9, demand: 0},
               {month: 10, demand: 0},
               {month: 11, demand: 0},
               {month: 12, demand: 0}]
             };
    
    $scope.graphCell = graph.getGraph().getCell($scope.nodeId);

    if (!$scope.graphCell) {
      $state.go('model');
    } else {
      $scope.node.name = $scope.graphCell.get('name');
      $scope.node.type = $scope.graphCell.get('nodeType');
    }

    $scope.gridOptions = { 
      data: 'node.demands',
      enableSorting: false,
      enableCellEditOnFocus: true,
      columnDefs: [
        {displayName: 'Month', field: 'month'},
        {displayName: "Demand (MGD)", field: 'demand', enableCellEdit: true}
      ]
    };

    $scope.$watch('node.name', function(newName) {
      $scope.graphCell.set('name', newName);
      $scope.graphCell.attr('.label/text', newName);
    });

    $scope.$watch('node.demands', function(newDemands) {
      console.log('update node.demands', newDemands);
    }, true);

    $scope.remove = function() {
      $scope.graphCell.remove();
      $state.go('model');
    };

  }]);