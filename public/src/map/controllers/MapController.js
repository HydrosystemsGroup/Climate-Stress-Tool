
angular.module('cst.map')
  .controller('MapCtrl', function() {
    console.log('MapCtrl: load');

    this.coordinate = [];
    this.features = [];

    this.clearCoordinate = function() {
      this.coordinate = [];
      this.features = [];
    };
    // this.location = {
    //   coordinate: [],
    //   features: []
    // };

    // this.clearCoordinate = function() {
    //   this.location.coordinate = [];
    //   this.location.features = [];
    // };
  });
