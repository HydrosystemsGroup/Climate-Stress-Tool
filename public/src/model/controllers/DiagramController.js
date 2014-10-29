
angular.module('model')
  .controller('DiagramCtrl', ['$scope', '$state', 'Graph', 'ModelService', function($scope, $state, graph, model) {
    model.init($('#diagram'));

    // register click event for clicking element
    graph.onClick('cell:pointerdown', function(cellView, evt, x, y) { 
      console.log('cell view ' + cellView.model.get('nodeType') + ' was clicked with id ' + cellView.model.get('id')); 
      $state.go('model.node', {nodeId: cellView.model.get('id')});
    });
  }]);
