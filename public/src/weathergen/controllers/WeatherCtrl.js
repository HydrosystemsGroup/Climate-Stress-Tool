
angular.module('cst.weathergen')
  .controller('WeatherCtrl', ['$scope', '$state', 
    function($scope, $state) { 
      console.log('WeatherCtrl');

      $scope.data = {
        source: null,
        attrs: {},
        values: []
      };
    }
  ]);
