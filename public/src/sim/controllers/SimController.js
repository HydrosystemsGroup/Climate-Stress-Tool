
angular.module('sim')
  .controller('SimCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.message = 'Hello sim';    
    $scope.model = {
      location: null,
      flow: null,
      climate: null,
      system: null
    };
  }]);
