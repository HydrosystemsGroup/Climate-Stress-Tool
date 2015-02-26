
angular.module('cst.weathergen')
  .controller('DataCtrl', ['dataService',
    function(dataService) {
      console.log('DataCtrl: load');
      this.data = dataService;
    }
  ]);
