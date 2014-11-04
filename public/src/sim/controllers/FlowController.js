
angular.module('sim')
  .controller('FlowCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.gridOptions = {
      data: 'model.flow',
      enableColumnMenu: false,
      columnDefs: []
    };


    $scope.onFileSelect = function($files) {
      console.log($files);
      if ($files.length > 1) {
        alert("Only one file may be selected, got " + $files.length);
        return;
      }
      Papa.parse($files[0], {
        header: true,
        complete: function(results) {
          if (results.errors.length > 0) {
            console.log('Error parsing csv file');
            // flash.error = 'Error parsing file';
            console.log(results.errors);
          } else {
            $scope.$apply(function() {
              $scope.headers = results.meta.fields;
              $scope.model.flow = results.data;

              $scope.gridOptions.columnDefs = [];
              angular.forEach($scope.headers, function(field) {
                $scope.gridOptions.columnDefs.push({name: field, displayName: field});
              });
            });
          }
        }
      });
    };
  }]);
