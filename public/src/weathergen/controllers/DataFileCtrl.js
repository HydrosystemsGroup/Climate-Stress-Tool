
angular.module('cst.weathergen')
  .controller('DataFileCtrl', ['$state', '$scope', 'messageCenterService', 'dataService', '$upload',
    function($state, $scope, messageCenterService, dataService, $upload) {
      console.log('DataViewCtrl: load');

      var ctrl = this;
      $scope.fetching = false;
      $scope.data = dataService;

      $scope.loadFile = function(file) {
        console.log('loading');
        $scope.loading = true;
        console.log(file[0]);
        dataService.getValuesFromFile(file[0])
          .then(function(data) {
            ctrl.loading = false;
            console.log('Success', data);
            $state.go('weathergen.data.view');
          }, function(error) {
            console.log('Failed', error);
            ctrl.loading = false;
            messageCenterService.add('danger', '<b>Failed to load file</b><br>' + error, {html: true});
          });
      };
    }
  ]);
