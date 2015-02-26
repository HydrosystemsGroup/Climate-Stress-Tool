
angular.module('cst.weathergen')
  .service('dataService', ['$http', function($http) {
    console.log('dataService: load');

    this.values = [];
    this.attrs = {};
    this.source = null;

    this.hasData = function() {
      return this.values.length > 0;
    };

    var srv = this;

    this.getValuesByLocation = function(latitude, longitude) {
      return $http.get('/api/maurer', {
          params: {
            latitude: latitude,
            longitude: longitude
          }
        })
        .success(function(data, status, headers, config) {
          angular.forEach(data, function(d) {
            d.date = new Date(d.date);
          });
          srv.source = 'location';
          srv.attrs = {
            latitude: latitude,
            longitude: longitude
          };
          srv.values = data;
        });
    };
  }]);
