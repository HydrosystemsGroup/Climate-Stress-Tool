
angular.module('cst.weathergen')
  .controller('DataMapCtrl', ['$state', 'messageCenterService', 'dataService',
    function($state, messageCenterService, dataService) {
      console.log('DataMapCtrl: load');
      var ctrl = this;
      this.fetching = false;
      this.data = dataService;

      this.clearCoordinate = function() {
        this.coordinate = {
          latitude: null,
          longitude: null
        };
        this.features = [];
      };
      this.clearCoordinate();

      this.fetchData = function() {
        this.fetching = true;
        dataService.getValuesByLocation(this.coordinate.latitude, this.coordinate.longitude)
          .then(function() {
            ctrl.fetching = false;
            messageCenterService.add('success', 'Historical data retrieved');
          }, function(error) {
            ctrl.fetching = false;
            console.log(error);
            messageCenterService.add('danger', 'Failed to get historical data: ' + error.data);
          });
      };

      if (dataService.hasData() && dataService.source === 'location') {
        this.coordinate.latitude = dataService.attrs.latitude;
        this.coordinate.longitude = dataService.attrs.longitude;
      }
    }
  ]);
