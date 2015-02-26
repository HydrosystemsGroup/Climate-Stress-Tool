
angular.module('cst.map')
  .directive('map', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        height: "@",
        width: "@",
        coordinate: "=",
        features: "="
      },
      link: function (scope, element, attr) {
        element.height(scope.height || 300);
        element.width(scope.width || 300);

        var feature = new ol.Feature({
          geometry: null
        });

        var featureSource = new ol.source.Vector({
          features: [feature]
        });

        var featureLayer = new ol.layer.Vector({
          source: featureSource,
          style: new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({color: '#ff0000'}),
              stroke: new ol.style.Stroke({color: '#ffffff', width: 1})
            })
          })
        });

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
            stroke: new ol.style.Stroke({
              color: 'rgba(55,126,184,0.9)',
              width: 1
            })
          })]
        });

        var map = new ol.Map({
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            }),
            featureLayer,
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
          var coordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

          scope.$apply(function() {
            scope.coordinate = {
              latitude: coordinate[1],
              longitude: coordinate[0]
            };
          });
        });

        var getFeaturesFromPixel = function(pixel) {
          var features = [];

          map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            if (layer.get('name')) {
              features.push({
                layer: layer.get('name'),
                id: feature.get(layer.get('name')),
                name: feature.get('NAME')
              });
            }
          });
          return features;
        };

        $(map.getViewport()).on('mousemove', function(evt) {
          var pixel = map.getEventPixel(evt.originalEvent);
          getFeaturesFromPixel(pixel);
        });

        scope.$watch('coordinate', function(coordinate) {
          if (coordinate) {
            coordinate = ol.proj.transform([+coordinate.longitude, +coordinate.latitude],
                                           'EPSG:4326', 'EPSG:3857');
            feature.setGeometry(new ol.geom.Point(coordinate));

            var pixel = map.getPixelFromCoordinate(coordinate);
            scope.features = getFeaturesFromPixel(pixel);
          } else {
            feature.setGeometry();
          }
        }, true);
      },
      template: '<div class="map"></div>'
    };
  });