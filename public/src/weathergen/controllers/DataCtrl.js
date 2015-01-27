
angular.module('cst.weathergen')
  .controller('DataCtrl', ['$scope', '$state', 
    function($scope, $state) { 
      console.log('DataCtrl');

      $scope.submitData = function(source, attrs, values) {
        console.log('submitData', source);

        $scope.data.source = source;
        $scope.data.attrs = attrs;
        $scope.data.values = values;

        console.log($scope.data);

        $state.go('weathergen.historical');
      };
    }
  ]);
