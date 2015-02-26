
angular.module('cst.weathergen')
  .controller('SimCtrl', ['jobService',
    function(jobService) {
      console.log('SimCtrl: load');
      this.jobs = jobService;
    }
  ]);
