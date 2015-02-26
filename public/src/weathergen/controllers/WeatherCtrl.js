
angular.module('cst.weathergen')
  .controller('WeatherCtrl', ['dataService',
    function(dataService) {
      console.log('WeatherCtrl: load');
      this.data = dataService;
    }
  ]);
