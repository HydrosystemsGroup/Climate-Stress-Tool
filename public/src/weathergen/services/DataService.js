
angular.module('cst.weathergen')
  .service('dataService', ['$http', '$q', function($http, $q) {
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

    this.getValuesFromFile = function(file) {
      var deferred = $q.defer();
      Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
              if (results.errors.length > 0) {
                console.log('Error parsing upload file');
                console.log(results.errors);
                deferred.reject("Error reading file, see console log");
              } else {
                var header_diff = _.difference(['DATE', 'PRCP', 'TEMP', 'TMIN', 'TMAX', 'WIND'], results.meta.fields);
                console.log(header_diff);
                if (header_diff.length > 0) {
                  deferred.reject('Invalid column headers: ' + results.meta.fields.join(', '), ' (Expected: DATE, PRCP, TEMP, TMIN, TMAX, WIND)');
                } else {
                  var parsed = _.map(results.data, function(d) {
                    return {
                      date: new Date(d.DATE),
                      prcp: +d.PRCP,
                      temp: +d.TEMP,
                      tmin: +d.TMIN,
                      tmax: +d.TMAX,
                      wind: +d.WIND
                    };
                  });
                  srv.source = 'file';
                  srv.attrs = {
                    file: file
                  };
                  srv.values = parsed;
                  deferred.resolve(parsed);
                }
              }
            }
          });
      return deferred.promise;
    };
  }]);
