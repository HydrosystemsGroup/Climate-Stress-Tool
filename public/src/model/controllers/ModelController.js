
angular.module('model')
  .controller('ModelCtrl', ['$scope', '$window', 'ModelService', function($scope, $window, model) {
    
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
    
    $scope.selected = {};
    $scope.nodes = model.getNodes();
    $scope.$watch('nodes', function() {
      console.log('change to nodes');
    });
    
  }]);
