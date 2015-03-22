
angular.module('cst.weathergen')
  .service('jobService', ['$http', '$q', '$interval',
    function($http, $q, $interval) {
      console.log('jobService: load');
      var srv = this;

      this.jobs = [];

      this.postJob = function(type, data, inputs) {
        var url;
        if (type === 'run') {
          url = '/api/wgen';
        } else {
          url = '/api/batch';
        }
        return $http.post(url, {
            data: data,
            inputs: inputs
          })
          .success(function(job, status, headers, config) {
            srv.jobs.push({
              type: type,
              data: data,
              inputs: inputs,
              job: job
            });
            return job;
          });
      };

      this.getJob = function(id) {
        return $http.get('/api/wgen/' + id);
      };

      var timer;

      this.pollJob = function(id) {
        var deferred = $q.defer();

        timer = $interval(function() {
          console.log('polling...');
          srv.getJob(id)
            .then(function (response) {
              var data = response.data;
              deferred.notify(data);

              if (data.state === 'failed') {
                deferred.resolve(data);
                srv.stopPoll();
              }

              if (data.state === 'complete') {
                deferred.resolve(data);
                srv.stopPoll();
              }
            }, function (response) {
              deferred.reject(response.data);
            });
        }, 3000);

        return deferred.promise;
      };

      this.stopPoll = function() {
        if (timer) {
          $interval.cancel(timer);
        }
      };

      this.getRunOutput = function(id) {
        var deferred = $q.defer();

        d3.csv('/api/wgen/' + id + '/files/sim.csv')
          .row(function(d) {
            return {
              date: new Date(d.DATE),
              prcp: +d.PRCP,
              tmin: +d.TMIN,
              tmax: +d.TMAX,
              temp: +d.TEMP,
              wind: +d.WIND
            };
          }).get(function(error, rows) {
            if (error) {
              deferred.reject(error);
            } else {
              deferred.resolve(rows);
            }
          });
        return deferred.promise;
      };

  }]);
