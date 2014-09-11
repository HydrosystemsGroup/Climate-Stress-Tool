var app = angular.module('CST', ['ngRoute']);

app.value('ocpuUrl', 'http://54.164.95.173/ocpu');

app.service('ocpuService', ['$http', 'ocpuUrl', function($http, url) {
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


app.controller('IndexCtrl', ['$scope', function($scope) { }]);

app.controller('WeatherCtrl', ['$scope', 'ocpuService', function($scope, ocpu) { 
  $scope.latitude = 42;
  $scope.longitude = -72;
  $scope.session = null;
  $scope.getDataset = function() {
    console.log('getDataset()');
    ocpu.getMaurerMon(+$scope.latitude, +$scope.longitude, function(data, headers) {
      $scope.session = headers['x-ocpu-session'];

      ocpu.aggregateMaurerMon($scope.session, function(data, headers) {
        var sessionAnnual = headers['x-ocpu-session'];
        $scope.session_yr = sessionAnnual;

        ocpu.getData(sessionAnnual, 'json', function(data) {
          $scope.data_yr = data;
        });
      });

      ocpu.getData($scope.session, 'json', function(data) {
        $scope.data = [];
        angular.forEach(data, function(d, i) {
          d.DATE = new Date(d.DATE);
          this.push(d);
        }, $scope.data);
      });
    });
  };
}]);

app.directive('timeseriesChart', function() {
  function link(scope, element, attr) {
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 1170 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(scope.accessorX(d)); })
        .y(function(d) { return y(scope.accessorY(d)); });

    var svg = d3.select(element[0]).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")");

      svg.append("g")
          .attr("class", "y axis")
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(attr.labelY);
    
    scope.$watch('data', function(data) {
      if (data) {
        x.domain(d3.extent(data, scope.accessorX));
        y.domain([ attr.minY || d3.min(data, scope.accessorY), 
                   d3.max(data, scope.accessorY) ]);

        svg.select('.x.axis').call(xAxis);
        svg.select('.y.axis').call(yAxis);

        svg.selectAll(".line")
            .data([data])
          .enter()
            .append("path")
            .attr("class", "line");

        svg.selectAll(".line")
            .attr("d", line);  
      }
    }, true);
  }

  return {
    link: link,
    restrict: 'E',
    scope: {
      data: '=',
      accessorY: '&',
      accessorX: '&'
    }
  }
});


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/templates/index.html',
        controller: 'IndexCtrl'
      }).
      when('/weather', {
        templateUrl: 'app/templates/weather.html',
        controller: 'WeatherCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);