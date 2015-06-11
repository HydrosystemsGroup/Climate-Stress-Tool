
var app = angular.module('cst.weathergen', ['MessageCenterModule', 'angularFileUpload']);

app.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('weathergen', {
        url: '/weathergen',
        template: '<div ui-view></div>',
        controller: 'WeatherCtrl',
        controllerAs: 'wgen'
      })
      .state('weathergen.data', {
        url: '/data',
        template: '<div ui-view></div>',
        controller: 'DataCtrl',
        controllerAs: 'data'
      })
      .state('weathergen.data.map', {
        url: '/map',
        templateUrl: 'weathergen/templates/data-map.html',
        controller: 'DataMapCtrl',
        controllerAs: 'map'
      })
      .state('weathergen.data.file', {
        url: '/file',
        templateUrl: 'weathergen/templates/data-file.html',
        controller: 'DataFileCtrl'
      })
      .state('weathergen.data.view', {
        url: '/view',
        templateUrl: 'weathergen/templates/data-view.html',
        controller: 'DataViewCtrl'
      })
      .state('weathergen.sim', {
        url: '/sim',
        template: '<div ui-view></div>',
        controller: 'SimCtrl',
        controllerAs: 'sim'
      })
      .state('weathergen.sim.run', {
        url: '/run',
        templateUrl: 'weathergen/templates/sim-run.html',
        controller: 'SimRunCtrl',
        controllerAs: 'setupRun'
      })
      .state('weathergen.sim.batch', {
        url: '/batch',
        templateUrl: 'weathergen/templates/sim-batch.html',
        controller: 'SimBatchCtrl',
        controllerAs: 'setupBatch'
      })
      .state('weathergen.sim.jobs', {
        url: '/jobs',
        templateUrl: 'weathergen/templates/sim-jobs.html',
        controller: 'SimJobsCtrl'
      })
      .state('weathergen.sim.job', {
        url: '/jobs/:id',
        templateUrl: 'weathergen/templates/sim-job.html',
        controller: 'SimJobCtrl',
        controllerAs: 'job',
        resolve: {
          job: function($stateParams, $state, messageCenterService, jobService) {
            console.log('resolve job');
            return jobService.getJob($stateParams.id)
              .success(function(data) { return data; })
              .error(function(data) {
                messageCenterService.add('danger', 'Error getting job: ' + data, {
                  status: messageCenterService.status.next,
                  timeout: 3000
                });
                $state.go('weathergen.sim.jobs');
              });
          }
        },
        onExit: function(jobService) {
          jobService.stopPoll();
        }
      });
  }]);