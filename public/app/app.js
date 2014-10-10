var app = angular.module('CST', ['ngRoute']);

app.value('ocpuUrl', 'http://xps420.local/ocpu');

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

app.factory('JointService', [function () {
  var Models = {};

  Models['reservoir'] = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

    defaults: joint.util.deepSupplement({

      type: 'devs.Model',
      size: { width: 1, height: 1 },
      
      inPorts: [],
      outPorts: [],

      attrs: {
        '.': { magnet: false },
        '.body': {
          width: 150, height: 250,
          stroke: 'black'
        },
        '.port-body': {
          r: 10,
          magnet: true,
          stroke: 'black'
        },
        text: {
          fill: 'black',
          'pointer-events': 'none'
        },
        '.label': { text: 'Model', 'ref-x': .3, 'ref-y': .2 },
        '.inPorts .port-label': { x:-15, dy: 4, 'text-anchor': 'end' },
        '.outPorts .port-label':{ x: 15, dy: 4 }
      }

    }, joint.shapes.basic.Generic.prototype.defaults),

    getPortAttrs: function(portName, index, total, selector, type) {
      var attrs = {};

      var portClass = 'port' + index;
      var portSelector = selector + '>.' + portClass;
      var portLabelSelector = portSelector + '>.port-label';
      var portBodySelector = portSelector + '>.port-body';

      attrs[portLabelSelector] = { text: portName };
      attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
      attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

      if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

      return attrs;
    }
  }));

  function out(m) {
      console.log(m);
  }

  var initial = {
    position: { x: 80, y: 50 } 
  };

  return {
    init: function(el) {
      this.graph = new joint.dia.Graph;
      this.paper = new joint.dia.Paper({ el: el, width: 650, height: 400, gridSize: 1, model: this.graph });
      
      window.graph = this.graph;


      this.graph.on('change:source change:target', function(link) {
        var sourcePort = link.get('source').port;
        var sourceId = link.get('source').id;
        var targetPort = link.get('target').port;
        var targetId = link.get('target').id;

        var m = [
            'The port <b>' + sourcePort,
            '</b> of element with ID <b>' + sourceId,
            '</b> is connected to port <b>' + targetPort,
            '</b> of elemnt with ID <b>' + targetId + '</b>'
        ].join('');
        
        out(m);
      });
    },
    createReservoir: function(cfg) {
      var m = new Models.reservoir(cfg);
      return m;
    },
    addReservoir: function(cfg) {
      var m1 = this.createReservoir({
          position: initial.position,
          size: { width: 90, height: 90 },
          inPorts: ['inflow'],
          outPorts: ['outflow', 'demand'],
          attrs: {
              '.label': { text: cfg.name || 'Reservoir', 'ref-x': 0.5, 'ref-y': .2 },
              rect: { fill: '#2ECC71' },
              '.inPorts circle': { fill: '#16A085' },
              '.outPorts circle': { fill: '#E74C3C' }
          }
      });
      this.graph.addCell(m1);

      initial.position = {x: initial.position.x+50, y: initial.position.y+50};
    }
  }
}]);

app.controller('ModelCtrl', ['$scope', 'JointService', function($scope, joint) {
  joint.init($('#diagram'));

  $scope.addReservoir = function () {
    joint.addReservoir({name: 'New Model'});
  }
}]);

app.controller('MapCtrl', ['$scope', function($scope) {
  $scope.map = {};

  var feature = new ol.Feature({
    geometry: null,
    name: 'Null Island',
    population: 4000,
    rainfall: 500
  });
  window.feature = feature;

  var vectorSource = new ol.source.Vector({
    features: [feature]
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({color: '#ff0000'}),
        stroke: new ol.style.Stroke({color: '#ffffff', width: 1})
      })
    })
  });

  // window.layer = layer;
  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        // source: new ol.source.MapQuest({layer: 'sat'})
        source: new ol.source.OSM()
      }),
      vectorLayer
    ],
    view: new ol.View({
      center: ol.proj.transform([-72, 42], 'EPSG:4326', 'EPSG:3857'),
      zoom: 6
    })
  });

  map.on('click', function(evt) {
    var coordinate = evt.coordinate;
    var wgs84 = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    // var hdms = ol.coordinate.toStringHDMS(wgs84);
    $scope.map.coordinate = wgs84;
    $scope.$digest();
  });

  $scope.$watch('map.coordinate', function(value) {
    if (value) {
      value = ol.proj.transform(value, 'EPSG:4326', 'EPSG:3857');
      feature.setGeometry(new ol.geom.Point(value));  
    } else {
      feature.setGeometry();
    }
  });

  $scope.clearCoordinate = function() {
    delete $scope.map.coordinate;
  };
}])

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
      when('/model', {
        templateUrl: 'app/templates/model.html',
        controller: 'ModelCtrl'
      }).
      when('/map', {
        templateUrl: 'app/templates/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);