
angular.module('cst.model')
  .factory('Reservoir', [function () {
    var reservoirNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        getName: function() {
          return this.get('name');
        },
        defaults: joint.util.deepSupplement({
          type: 'devs.Model',
          nodeType: 'reservoir',

          size: { width: 90, height: 90 },
          
          inPorts: ['inflow'],
          outPorts: ['outflow', 'demand'],
          
          attrs: {

            rect: { fill: '#A6CEE3' },
            '.': { magnet: false },
            '.body': {
              width: 150, height: 250,
              stroke: 'black'
            },

            text: {
              fill: 'black',
              'pointer-events': 'none'
            },

            '.label': { 
              text: 'Reservoir'
              // 'ref-x': 0.4, 
              // 'ref-y': 0.2
            },
            // '.label': { text: 'Model', 'ref-x': 0.3, 'ref-y': 0.2 },

            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.inPorts circle': { fill: '#FF7F00' },
            '.outPorts circle': { fill: '#FF7F00' },
            '.inPorts .port-label': { x:-15, dy: 4, 'text-anchor': 'end' },
            '.outPorts .port-label':{ x: 15, dy: 4 }
          }
        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {
          var attrs = {};

          var portClass = 'port' + index;
          var portSelector = selector + '>.' + portClass;
          var portLabelSelector = portSelector + '>.port-label';
          var portBodySelector = portSelector + '>.port-body';

          attrs[portLabelSelector] = { text: portName };
          attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
          attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

          if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

          return attrs;
        }
      }));

    return {
      create: function(cfg) {
        var reservoir = new reservoirNode(cfg);
        reservoir.attr('.label/text', cfg.name || 'New Reservoir');
        return reservoir;
      }
    };
  }])
  .factory('Demand', [function () {
    var demandNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/></g>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          type: 'devs.Model',
          nodeType: 'demand',
          demands: [ {month: 1, demand: 0},
                     {month: 2, demand: 0},
                     {month: 3, demand: 0},
                     {month: 4, demand: 0},
                     {month: 5, demand: 0},
                     {month: 6, demand: 0},
                     {month: 7, demand: 0},
                     {month: 8, demand: 0},
                     {month: 9, demand: 0},
                     {month: 10, demand: 0},
                     {month: 11, demand: 0},
                     {month: 12, demand: 0} ],

          size: { width: 90, height: 90 },
          
          inPorts: ['demand'],

          attrs: {
            rect: { fill: '#B2DF8A' },
            '.': { magnet: false },
            '.body': {
              width: 150, height: 250,
              stroke: 'black'
            },

            text: {
              fill: 'black',
              'pointer-events': 'none'
            },

            '.label': { 
              text: 'Demand'
              // 'ref-x': 0.5, 
              // 'ref-y': 0.2
            },

            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.inPorts circle': { fill: '#FF7F00' },
            '.inPorts .port-label': { x:-15, dy: 4, 'text-anchor': 'end' },
          }
        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {
          var attrs = {};

          var portClass = 'port' + index;
          var portSelector = selector + '>.' + portClass;
          var portLabelSelector = portSelector + '>.port-label';
          var portBodySelector = portSelector + '>.port-body';

          attrs[portLabelSelector] = { text: portName };
          attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
          attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

          if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

          return attrs;
        }
    }));

    return {
      create: function(cfg) {
        var demand = new demandNode(cfg);
        demand.attr('.label/text', cfg.name || 'New Demand');
        return demand;
      }
    };
  }])
  .factory('Inflow', [function () {
    var inflowNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="scalable"><rect class="body"/></g><text class="label"/><g class="outPorts"/>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          type: 'devs.Model',
          nodeType: 'inflow',

          size: { width: 90, height: 90 },
          
          outPorts: ['outflow'],

          attrs: {
            '.': { magnet: false },
            '.body': {
              width: 200, height: 250,
              stroke: 'black'
            },
            rect: { fill: '#FDBF6F' },
            text: {
              fill: 'black',
              'pointer-events': 'none'
            },
            '.label': { 
              text: 'Inflow'
              // 'ref-x': 0.2,
              // 'ref-y': 0.2
            },
            '.port-body': {
              r: 10,
              magnet: true,
              stroke: 'black'
            },
            '.outPorts circle': { fill: '#FF7F00' },
            '.outPorts .port-label': { 
              x: 15, dy: 4 
            }
          }
        }, joint.shapes.basic.Generic.prototype.defaults),

        getPortAttrs: function(portName, index, total, selector, type) {
          var attrs = {};

          var portClass = 'port' + index;
          var portSelector = selector + '>.' + portClass;
          var portLabelSelector = portSelector + '>.port-label';
          var portBodySelector = portSelector + '>.port-body';

          attrs[portLabelSelector] = { text: portName };
          attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
          attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };

          if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }

          return attrs;
        }
      }));

      return {
        create: function(cfg) {
          var inflow = new inflowNode(cfg);
          inflow.attr('.label/text', cfg.name || 'New Inflow');
          return inflow;
        }
      };
  }])
  .factory('Graph', [function () {
    function validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
      if (!magnetT) {
        return false;
      }

      var sourcePort = magnetS.getAttributeNode('port').value,
          targetPort = magnetT.getAttributeNode('port').value;

      if (cellViewS.id === cellViewT.id) {
        return false;
      }

      if (((sourcePort==='outflow') && (targetPort==='inflow')) || 
          ((sourcePort==='inflow') && (targetPort==='outflow'))) {
        return true;
      } 

      if ((sourcePort==='demand') && (targetPort==='demand')) {
        return true;
      } 

      return false;
    }

    var link = joint.dia.Link.extend({
        defaults: {
          smooth: true
        }
    });

    return {
      init: function(el) {
        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({ 
          el: el, 
          width: 650, 
          height: 400, 
          gridSize: 1, 
          model: this.graph,
          snapLinks: true,
          defaultLink: new joint.dia.Link({
            smooth: true,
            router: { name: 'manhattan' },
            connector: { name: 'rounded' }
          }),
          validateConnection: validateConnection
        });
        
        this.graph.on('change:source change:target', function(link) {
          var sourcePort = link.get('source').port;
          var sourceId = link.get('source').id;
          var targetPort = link.get('target').port;
          var targetId = link.get('target').id;
          if (sourceId && targetId) {
            console.log('Link:', link);
            console.log('Source:', link.get('source'));
            console.log('Target: ', link.get('target'));
            var m = [
                'The port <b>' + sourcePort,
                '</b> of element with ID <b>' + sourceId,
                '</b> is connected to port <b>' + targetPort,
                '</b> of element with ID <b>' + targetId + '</b>'
            ].join('');
            
            console.log(m);
          }
        });

        // remove links without source or target
        this.graph.on('batch:stop', function () {
          var links = this.getLinks();
          _.each(links, function (link) {
            var source = link.get('source');
            var target = link.get('target');
            if (source.id === undefined || target.id === undefined) {
              link.remove();
            }
          });
        });
        
        return this.graph;
      },

      onClick: function(evt, cb) {
        this.paper.on(evt, cb);
      },

      getGraph: function() {
        return this.graph;
      },

      getPaper: function() {
        return this.paper;
      }
    };
  }])
  .factory('ModelService', ['Reservoir', 'Demand', 'Inflow', 'Graph', function (reservoir, demand, inflow, graph) {
    var nodes = [];

    var initial = {
      position: { x: 80, y: 50 } 
    };

    return {
      addReservoir: function(cfg) {
        var newReservoir = reservoir.create({
            position: initial.position,
            name: cfg.name || 'New Reservoir'
        });
        nodes.push(newReservoir);
        graph.getGraph().addCell(newReservoir);
        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addDemand: function(cfg) {
        var newDemand = demand.create({
            position: initial.position,
            name: cfg.name || 'New Demand'
        });
        nodes.push(newDemand);
        graph.getGraph().addCell(newDemand);
        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addInflow: function(cfg) {
        var newInflow = inflow.create({
            position: initial.position,
            name: cfg.name || 'New Inflow'
        });
        nodes.push(newInflow);
        graph.getGraph().addCell(newInflow);
        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      getNodes: function() {
        return nodes;
      },

      clear: function () {
        graph.getGraph().clear();
        nodes = [];
      }
    };

  }]);
