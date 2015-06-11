
angular.module('cst.weathergen')
  .controller('WeatherCtrl', ['dataService', '$http',
    function(dataService, $http) {
      console.log('WeatherCtrl: load');
      this.data = dataService;
      $http.get('/api/jobs')
        .success(function(data, status, headers, config) {
          console.log('GET /api/jobs');
          console.log(data);
        });
    }
  ]);
