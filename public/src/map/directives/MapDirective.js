
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
  });