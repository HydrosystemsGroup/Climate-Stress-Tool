
angular.module('cst.map')
  .controller('MapCtrl', function() {
    console.log('MapCtrl: load');

    this.coordinate = {
      latitude: null,
      longitude: null
    };
    this.features = [];

    this.clearCoordinate = function() {
      this.coordinate = {
        latitude: null,
        longitude: null
      };
      this.features = [];
    };
  });
