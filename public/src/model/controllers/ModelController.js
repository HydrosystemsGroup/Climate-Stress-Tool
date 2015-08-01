
angular.module('cst.model')
  .controller('ModelCtrl',
    ['$scope', '$state', 'ModelService', 'Graph',
    function ($scope, $state, model, graph) {
      // console.log('ModelCtrl');
      $scope.debug = false;

      graph.init($('#diagram'));

      // register click event for clicking element
      graph.onClick('cell:pointerdblclick', function (cellView, evt, x, y) {
        console.log('cell view ' + cellView.model.get('nodeType') +
                    ' was clicked with id ' + cellView.model.get('id'));
        $state.go('model.' + cellView.model.get('nodeType'), {
          nodeId: cellView.model.get('id')
        });
      });

      $scope.nodes = model.getNodes();

      $scope.addReservoir = function () {
        model.addReservoir({name: 'New Reservoir'});
      };

      $scope.addDemand = function () {
        model.addDemand({name: 'New Demand'});
      };

      $scope.addInflow = function () {
        model.addInflow({name: 'New Inflow'});
      };

      $scope.logNodes = function () {
        console.log('Nodes:', model.getNodes());
      };

      $scope.toJSON = function () {
        console.log(graph.getGraph().toJSON());
      };

      $scope.clear = function () {
        model.clear();
        $scope.nodes = [];
      };
    }]
  );
