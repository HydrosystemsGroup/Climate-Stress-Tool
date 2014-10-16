
angular.module('model')
  .controller('ModelCtrl', ['$scope', 'JointService', function($scope, joint) {
    joint.init($('#diagram'));

    $scope.addReservoir = function () {
      joint.addReservoir({name: 'New Model'});
    };
  }]);
