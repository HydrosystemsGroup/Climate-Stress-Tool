
angular.module('cst.weathergen')
  .controller('WeatherCtrl', ['dataService', '$http',
    function(dataService, $http) {
      console.log('WeatherCtrl: load');
      this.data = dataService;
    }
  ]);
