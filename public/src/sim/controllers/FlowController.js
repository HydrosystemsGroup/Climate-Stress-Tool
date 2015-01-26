
angular.module('cst.sim')
  .controller('FlowCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.flow = {
      data: [],
      drainage_area: null
    };

    if ($scope.model.flow && $scope.model.flow.data) {
      $scope.flow.data = $scope.model.flow.data;
    }
    if ($scope.model.flow && $scope.model.flow.drainage_area) {
      $scope.flow.drainage_area = $scope.model.flow.drainage_area;
    }

    $scope.gridOptions = {
      data: 'model.flow.data',
      enableColumnMenu: false,
      columnDefs: []
    };

    $scope.saveFlows = function() {
      if (!($scope.model.flow)) {
        $scope.model.flow = {};
      }
      $scope.model.flow.data = $scope.flow.data;
      $scope.model.flow.drainage_area = $scope.flow.drainage_area;
    };

    $scope.clearFlows = function() {
      $scope.flow.data = [];
      $scope.flow.drainage_area = null;
      $scope.model.flow = null;
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
              $scope.flow.data = results.data;

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
