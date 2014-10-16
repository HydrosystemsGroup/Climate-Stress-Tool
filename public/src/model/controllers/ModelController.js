
angular.module('model')
  .controller('ModelCtrl', ['$scope', '$window', 'ModelService', function($scope, $window, model) {
    model.init($('#diagram'));
    $window.model = model;

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
