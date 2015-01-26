
angular.module('cst.ocpu')
  .value('ocpuUrl', '//xps420.local/ocpu')
  .service('ocpuService', ['$http', 'ocpuUrl', function($http, url) {
    this.getData = function(sessionKey, format, cb) {
      $http.get(url+'/tmp/' + sessionKey + '/R/.val/' + format).
        success(function(data, status, headers, config) {
          console.log('getData: SUCCESS');
          cb(data);
        })
        .error(function(data, status, headers, config) {
          console.log('getData: ERROR');
          console.log(data);
        });
    };

    this.getMaurerMon = function(latitude, longitude, cb) {
      $http.post((url + '/library/weathergen/R/get_maurer_mon'), 
                 {lat: +latitude, lon: +longitude}).
        success(function(data, status, headers, config) {
          console.log('getMaurerMon: SUCCESS');
          cb(data, headers());
        }).
        error(function(data, status, headers, config) {
          console.log('getMaurerMon: ERROR');
          console.log(data);
        });
    };

    this.aggregateMaurerMon = function(sessionKey, cb) {
      console.log('aggregateMaurerMon:', sessionKey);
      $http({url: url + '/library/weathergen/R/aggregate_maurer_mon',
             method: 'POST',
             data: 'x='+sessionKey,
             headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).
        success(function(data, status, headers, config) {
          console.log('aggregateMaurerMon: SUCCESS');
          cb(data, headers());
        }).
        error(function(data, status, headers, config) {
          console.log('aggregateMaurerMon: ERROR');
          console.log(data);
        });
    };
  }]);