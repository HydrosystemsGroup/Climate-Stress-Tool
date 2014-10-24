
angular.module('model')
  .controller('ModelCtrl', ['$scope', 'ModelService', function($scope, model) {
    
    $scope.addReservoir = function () {
      model.addReservoir({name: 'New Reservoir'});
    };

    $scope.addDemand = function () {
      model.addDemand({name: 'New Demand'});
    };

    $scope.addInflow = function () {
      model.addInflow({name: 'New Inflow'});
    };

    $scope.logNodes = function () {
      console.log('Nodes:', model.getNodes());
    };

    $scope.toJSON = function () {
      console.log(model.getGraph().toJSON());
    };
    
    $scope.selected = {};
    
    $scope.nodes = model.getNodes();

    $scope.$watch('nodes', function() {
      console.log('change to nodes');
      console.log($scope.nodes);
    });
    
  }]);
