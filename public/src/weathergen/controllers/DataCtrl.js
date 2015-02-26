
angular.module('cst.weathergen')
  .controller('DataCtrl', ['$scope', '$state',
    function($scope, $state) {
      console.log('DataCtrl: load');

      // $scope.submitData = function(source, attrs, values) {
      //   console.log('submitData', source);

      //   var dateFormat = d3.time.format('%b %e, %Y');
      //   var dateRange = d3.extent(values, function(d) { return d.date; });

      //   attrs.start = dateFormat(dateRange[0]);
      //   attrs.end = dateFormat(dateRange[1]);

      //   $scope.data.source = source;
      //   $scope.data.attrs = attrs;
      //   $scope.data.values = values;

      //   $state.go('weathergen.historical');
      // };
    }
  ]);
