
angular.module('charts', []);
;
angular.module('home', []);
;
angular.module('map', []);
;
angular.module('model', []);
;
angular.module('ocpu', []);
;
angular.module('weathergen', ['ocpu']);
;
var app = angular.module('climate-stress-tool', 
  ['ngRoute',
   'templates',
   'home',
   'ocpu',
   'weathergen',
   'model',
   'charts',
   'map']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'home/templates/home.html',
        controller: 'HomeCtrl'
      }).
      when('/weather', {
        templateUrl: 'weathergen/templates/weather.html',
        controller: 'WeatherCtrl'
      }).
      when('/model', {
        templateUrl: 'model/templates/model.html',
        controller: 'ModelCtrl'
      }).
      when('/map', {
        templateUrl: 'map/templates/map.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }]);
;
angular.module('charts')
  .directive('timeseriesChart', function() {
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
    };
  });
;angular.module('home')
  .controller('HomeCtrl', ['$scope', function($scope) { }]);
;
angular.module('map')
  .controller('MapCtrl', ['$scope', function($scope) {
    $scope.coordinate = [];
    $scope.features = {};

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };
  }]);
;
angular.module('map')
  .directive('map', function() {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, element, attr) {
        var feature = new ol.Feature({
          geometry: null
        });
        window.feature = feature;

        var vectorSource = new ol.source.Vector({
          features: [feature]
        });

        var styleArray = [];

        var huc8Layer = new ol.layer.Vector({
          source: new ol.source.TopoJSON({
            url: 'https://s3.amazonaws.com/climate-stress-tool/WBDHU8_east_topo.json'
          }),
          name: 'HUC8',
          style: [new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new ol.style.Stroke({
              color: '#319FD3',
              width: 2
            })
          })]
        });

        var huc12Layer = new ol.layer.Vector({
          source: new ol.source.TopoJSON({
            url: 'https://s3.amazonaws.com/climate-stress-tool/WBDHU12_east_topo.json'
          }),
          name: 'HUC12',

          minResolution: 0,
          maxResolution: 200,
          style: [new ol.style.Style({
            // fill: new ol.style.Fill({
            //   color: 'rgba(255, 255, 255, 0.1)'
            // }),
            stroke: new ol.style.Stroke({
              color: 'rgba(55,126,184,0.9)',
              width: 1
            })
          })]
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
          layers: [
            new ol.layer.Tile({
              // source: new ol.source.MapQuest({layer: 'sat'})
              source: new ol.source.OSM()
            }),
            vectorLayer,
            huc8Layer,
            huc12Layer
          ],
          view: new ol.View({
            center: ol.proj.transform([-72, 42], 'EPSG:4326', 'EPSG:3857'),
            zoom: 7
          })
        });

        map.setTarget(element[0]);

        map.on('click', function(evt) {
          var coordinate = evt.coordinate;
          var wgs84 = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
          // var hdms = ol.coordinate.toStringHDMS(wgs84);
          scope.coordinate = wgs84;

          // moved to watch(coordinate)
          // var pixel = map.getEventPixel(evt.originalEvent);
          // scope.features = getFeaturesFromPixel(pixel);

          scope.$digest();
        });
        window.map = map;

        var getFeaturesFromPixel = function(pixel) {

          var features = [];
          map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            // console.log(feature.getKeys(), feature.get('HUC8'), feature.get('NAME'));
            // console.log(layer.get('name'));
            // features.push(feature);
            // layers.push(layer);
            if (layer.get('name')) {
              features.push({
                layer: layer.get('name'),
                id: feature.get(layer.get('name')),
                name: feature.get('NAME')
              }); 
            }
          });
          // }, this, function(layer) { return layer.get('name')=='huc12'; });
          // console.log(features);
          return features;

          // var info = document.getElementById('info');
          // if (feature) {
          //   info.innerHTML = feature.getId() + ': ' + feature.get('name');
          // } else {
          //   info.innerHTML = '&nbsp;';
          // }

          // if (feature !== highlight) {
          //   if (highlight) {
          //     featureOverlay.removeFeature(highlight);
          //   }
          //   if (feature) {
          //     featureOverlay.addFeature(feature);
          //   }
          //   highlight = feature;
          // }

        };

        $(map.getViewport()).on('mousemove', function(evt) {
          var pixel = map.getEventPixel(evt.originalEvent);
          getFeaturesFromPixel(pixel);
        });

        scope.$watch('coordinate', function(value) {
          if (value) {
            value = [+value[0], +value[1]];
            // console.log(value);
            var coordinate = ol.proj.transform(value, 'EPSG:4326', 'EPSG:3857');
            feature.setGeometry(new ol.geom.Point(coordinate));  

            var pixel = map.getPixelFromCoordinate(coordinate);
            scope.features = getFeaturesFromPixel(pixel);
            // console.log(scope.features);
          } else {
            feature.setGeometry();
          }
        }, true);
      },
      template: '<div class="map" style="height: 300px"></div>'
    };
  });;
angular.module('model')
  .controller('ModelCtrl', ['$scope', '$window', 'ModelService', function($scope, $window, model) {
    model.init($('#diagram'));
    $window.model = model;

    $scope.addReservoir = function () {
      model.addReservoir({name: 'Reservoir'});
    };

    $scope.addDemand = function () {
      model.addDemand({name: 'Demand'});
    };

    $scope.addInflow = function () {
      model.addInflow({name: 'Inflow'});
    };

    $scope.logNodes = function () {
      console.log('Nodes:', model.getNodes());
    };
  }]);
;
angular.module('model')
  .factory('Reservoir', [function () {
    var reservoirNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
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
          '.label': { text: 'Model', 'ref-x': 0.3, 'ref-y': 0.2 },
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

    return {
      create: function(cfg) {
        return new reservoirNode(cfg);
      }
    };
  }])
  .factory('Demand', [function () {
    var demandNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="scalable"><rect class="body"/></g><text class="label"/><g class="outPorts"/>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          size: { width: 90, height: 90 },
          type: 'devs.Model',
          outPorts: ['demand'],
          attrs: {
            '.': { magnet: false },
            '.body': {
              width: 200, height: 250,
              stroke: 'black'
            },
            rect: { fill: '#B2DF8A' },
            text: {
              fill: 'black',
              'pointer-events': 'none'
            },
            '.label': { 
              // text: cfg.name || 'Demand'
              text: 'Demand',
              'ref-x': 0.2,
              'ref-y': 0.2
            },
            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.outPorts circle': { fill: '#FF7F00' },
            '.outPorts .port-label': { 
              x: 15, dy: 4 
            }
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

      return {
        create: function(cfg) {
          return new demandNode(cfg);
        }
      };
  }])
  .factory('Inflow', [function () {
    var inflowNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="scalable"><rect class="body"/></g><text class="label"/><g class="outPorts"/>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          size: { width: 90, height: 90 },
          type: 'devs.Model',
          outPorts: ['outflow'],
          attrs: {
            '.': { magnet: false },
            '.body': {
              width: 200, height: 250,
              stroke: 'black'
            },
            rect: { fill: '#FDBF6F' },
            text: {
              fill: 'black',
              'pointer-events': 'none'
            },
            '.label': { 
              text: 'Inflow',
              'ref-x': 0.2,
              'ref-y': 0.2
            },
            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.outPorts circle': { fill: '#FF7F00' },
            '.outPorts .port-label': { 
              x: 15, dy: 4 
            }
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

      return {
        create: function(cfg) {
          return new inflowNode(cfg);
        }
      };
  }])
  .factory('ModelService', ['Reservoir', 'Demand', 'Inflow', function (reservoir, demand, inflow) {
    var nodes = [];

    function out(m) {
      console.log(m);
    }

    var initial = {
      position: { x: 80, y: 50 } 
    };

    return {
      init: function(el) {
        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({ el: el, width: 650, height: 400, gridSize: 1, model: this.graph });
        
        window.graph = this.graph;

        // this.graph.on('all', function(link) {
        //   console.log(arguments);
        // });
        this.graph.on('change:source change:target', function(link) {
          var sourcePort = link.get('source').port;
          var sourceId = link.get('source').id;
          var targetPort = link.get('target').port;
          var targetId = link.get('target').id;
          if (sourceId && targetId) {
            console.log('Link:', link);
            console.log('Source:', link.get('source'));
            console.log('Target: ', link.get('target'));
            var m = [
                'The port <b>' + sourcePort,
                '</b> of element with ID <b>' + sourceId,
                '</b> is connected to port <b>' + targetPort,
                '</b> of element with ID <b>' + targetId + '</b>'
            ].join('');
            
            out(m);
          }

        });
      },

      addReservoir: function(cfg) {
        var newReservoir = reservoir.create({
            position: initial.position,
            size: { width: 90, height: 90 },
            inPorts: ['inflow'],
            outPorts: ['outflow', 'demand'],
            attrs: {
                '.label': { text: cfg.name || 'Reservoir', 'ref-x': 0.5, 'ref-y': 0.2 },
                rect: { fill: '#A6CEE3' },
                '.inPorts circle': { fill: '#FF7F00' },
                '.outPorts circle': { fill: '#FF7F00' }
            }
        });

        nodes.push(newReservoir);

        this.graph.addCell(newReservoir);

        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addDemand: function(cfg) {
        var newDemand = demand.create({
            position: initial.position
        });

        nodes.push(newDemand);

        this.graph.addCell(newDemand);

        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addInflow: function(cfg) {
        var newInflow = inflow.create({
            position: initial.position
        });

        nodes.push(newInflow);

        this.graph.addCell(newInflow);

        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      getNodes: function() {
        return nodes;
      },

      getGraph: function() {
        return this.graph;
      },

      getPaper: function() {
        return this.paper;
      }
    };
  }]);
;
angular.module('ocpu')
  .value('ocpuUrl', 'http://xps420.local/ocpu')
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
  }]);;
angular.module('weathergen')
  .controller('WeatherCtrl', ['$scope', '$filter', 'ocpuService', function($scope, $filter, ocpu) { 
    $scope.coordinate = [];
    $scope.features = {};
    $scope.loading = false;

    $scope.clearCoordinate = function() {
      $scope.coordinate = [];
      $scope.features = {};
    };

    $scope.session = null;
    
    $scope.getDataset = function() {
      console.log('getDataset()');
      $scope.loading = true;
      ocpu.getMaurerMon(+$scope.coordinate[1], +$scope.coordinate[0], function(data, headers) {
        $scope.session = headers['x-ocpu-session'];

        ocpu.aggregateMaurerMon($scope.session, function(data, headers) {
          var sessionAnnual = headers['x-ocpu-session'];
          $scope.session_yr = sessionAnnual;

          ocpu.getData(sessionAnnual, 'json', function(data) {
            $scope.loading = false;
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
;angular.module('templates', ['home/templates/home.html', 'map/templates/map.html', 'model/templates/model.html', 'weathergen/templates/weather.html']);

angular.module("home/templates/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/templates/home.html",
    "<div class=\"jumbotron\">\n" +
    "  <h1>Climate Stress Tool</h1>\n" +
    "  <p>This application is used to perform a climate stress test for evaluating water resources system vulnerability.</p>\n" +
    "  <button class=\"btn btn-primary\">Learn More</button>\n" +
    "</div>\n" +
    "\n" +
    "<p>{{message}}</p>");
}]);

angular.module("map/templates/map.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("map/templates/map.html",
    "<div class=\"row\" ng-controller=\"MapCtrl\">\n" +
    "  <div class=\"col-sm-6\">\n" +
    "    <map></map>\n" +
    "  </div>\n" +
    "  \n" +
    "  <div class=\"col-sm-6\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\">  \n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLatitude\" class=\"col-sm-2 control-label\">Latitude</label>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLatitude\" ng-model=\"coordinate[1]\">\n" +
    "          <p class=\"help-block\">Enter latitude in decimal degrees North.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLongitude\" class=\"col-sm-2 control-label\">Longitude</label>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLongitude\" ng-model=\"coordinate[0]\">\n" +
    "          <p class=\"help-block\">Enter longitude in decimal degrees East (negative values for West).</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "        <div class=\"form-group\">\n" +
    "          <div class=\"col-sm-10 col-sm-offset-2\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"clearCoordinate()\">Clear</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <div>\n" +
    "      <pre>{{coordinate | json}}</pre>\n" +
    "    </div>\n" +
    "\n" +
    "    <div>\n" +
    "      <pre>{{features | json}}</pre>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("model/templates/model.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("model/templates/model.html",
    "<div>\n" +
    "  <h1>Model</h1>\n" +
    "  <hr>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-2\">\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"addReservoir()\">Add Reservoir</button>\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"addDemand()\">Add Demand</button>\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"addInflow()\">Add Inflow</button>\n" +
    "      <hr>\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"logNodes()\">Show Nodes</button>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <div id=\"diagram\"></div>    \n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("weathergen/templates/weather.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("weathergen/templates/weather.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-4\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <legend>Weather Generator</legend>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLatitude\" class=\"col-sm-4 control-label\">Latitude</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLatitude\" ng-model=\"coordinate[1]\">\n" +
    "          <p class=\"help-block\">Enter latitude in decimal degrees North.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"inputLongitude\" class=\"col-sm-4 control-label\">Longitude</label>\n" +
    "        <div class=\"col-sm-8\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"inputLongitude\" ng-model=\"coordinate[0]\">\n" +
    "          <p class=\"help-block\">Enter longitude in decimal degrees East (negative values for West).</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-8 col-sm-offset-4\">\n" +
    "          <button type=\"submit\" class=\"btn btn-primary loadinggif\" ng-click=\"getDataset()\">Submit<span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\" ng-show='loading'></span></button>\n" +
    "          <button class=\"btn btn-danger\" ng-click=\"clearCoordinate()\">Clear</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-6\" height=\"200px\">\n" +
    "    <map></map>\n" +
    "  </div>\n" +
    "  <div class=\"col-sm-2\">\n" +
    "    <ul>\n" +
    "      <li ng-repeat='feature in features'>{{feature.layer}}: {{feature.id}} - {{feature.name}}</li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<hr>\n" +
    "<div ng-show=\"session\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <timeseries-chart data=\"data\" accessor-x=\"DATE\" accessor-y=\"PRCP\" label-y=\"Precip (mm)\" min-y=\"0\"></timeseries-chart>\n" +
    "      <timeseries-chart data=\"data\" accessor-x=\"DATE\" accessor-y=\"TMAX\" label-y=\"Max Temp (degC)\"></timeseries-chart>\n" +
    "      <timeseries-chart data=\"data\" accessor-x=\"DATE\" accessor-y=\"TMIN\" label-y=\"Min Temp (degC)\"></timeseries-chart>\n" +
    "      <timeseries-chart data=\"data\" accessor-x=\"DATE\" accessor-y=\"WIND\" label-y=\"Wind (m/s)\" min-y=\"0\"></timeseries-chart>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-sm-6\">\n" +
    "      <h2>Monthly</h2>\n" +
    "      <p><b>Session Key:</b> {{session}}</p>\n" +
    "      <table class=\"table table-striped\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Date</th>\n" +
    "            <th>Precip (mm)</th>\n" +
    "            <th>Tmax (degC)</th>\n" +
    "            <th>Tmin (degC)</th>\n" +
    "            <th>Wind (m/s)</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr ng-repeat=\"d in data | limitTo: 100\">\n" +
    "            <td>{{d.DATE | date:'yyyy-MM-dd'}}</td>\n" +
    "            <td>{{d.PRCP}}</td>\n" +
    "            <td>{{d.TMAX}}</td>\n" +
    "            <td>{{d.TMIN}}</td>\n" +
    "            <td>{{d.WIND}}</td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-6\">\n" +
    "      <h2>Annual</h2>\n" +
    "      <p><b>Session Key:</b> {{session_yr}}</p>\n" +
    "      <table class=\"table table-striped\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Year</th>\n" +
    "            <th>Precip (mm)</th>\n" +
    "            <th>Tmax (degC)</th>\n" +
    "            <th>Tmin (degC)</th>\n" +
    "            <th>Wind (m/s)</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr ng-repeat=\"d in data_yr | limitTo: 100\">\n" +
    "            <td>{{d.YEAR}}</td>\n" +
    "            <td>{{d.PRCP}}</td>\n" +
    "            <td>{{d.TMAX}}</td>\n" +
    "            <td>{{d.TMIN}}</td>\n" +
    "            <td>{{d.WIND}}</td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
