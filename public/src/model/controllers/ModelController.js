
angular.module('model')
  .controller('ModelCtrl', ['$scope', '$window', 'ModelService', function($scope, $window, model) {
    model.init($('#diagram'));
    
    $scope.element = undefined;
    
    $window.scope = $scope;
    $window.model = model.getGraph();

    // register click event for clicking element
    model.onClick('cell:pointerdown', function(cellView, evt, x, y) { 
      console.log('cell view ' + cellView.model.get('nodeType') + ' was clicked with id ' + cellView.model.id); 
      $scope.element = cellView.model;
    });

    $scope.addReservoir = function () {
      model.addReservoir({name: 'Reservoir'});
    };

    $scope.addDemand = function () {
      model.addDemand({name: 'Demand'});
    };

    $scope.addInflow = function () {
      model.addInflow({name: 'Inflow'});
    };

    $scope.logNodes = function () {
      console.log('Nodes:', model.getNodes());
    };
  }]);
