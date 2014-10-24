
angular.module('model')
  .controller('DiagramCtrl', ['$scope', '$window', '$state', 'ModelService', function($scope, $window, $state, model) {
    model.init($('#diagram'));

    // register click event for clicking element
    model.onClick('cell:pointerdown', function(cellView, evt, x, y) { 
      console.log('cell view ' + cellView.model.get('nodeType') + ' was clicked with id ' + cellView.model.id); 
      $state.go('model.node', {nodeId: cellView.model.get('id')});
    });
  }]);
