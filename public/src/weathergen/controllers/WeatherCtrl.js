
angular.module('cst.weathergen')
  .controller('WeatherCtrl', function() {
    console.log('WeatherCtrl: load');

    this.data = {
      source: null,
      attrs: {},
      values: []
    };
  });
