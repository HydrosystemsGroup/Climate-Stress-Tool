
angular.module('model')
  .factory('Reservoir', [function () {
    var reservoirNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
      markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
      portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

      defaults: joint.util.deepSupplement({

        type: 'devs.Model',
        size: { width: 1, height: 1 },
        
        inPorts: [],
        outPorts: [],

        attrs: {
          '.': { magnet: false },
          '.body': {
            width: 150, height: 250,
            stroke: 'black'
          },
          '.port-body': {
            r: 10,
            magnet: true,
            stroke: 'black'
          },
          text: {
            fill: 'black',
            'pointer-events': 'none'
          },
          '.label': { text: 'Model', 'ref-x': 0.3, 'ref-y': 0.2 },
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
        return new reservoirNode(cfg);
      }
    };
  }])
  .factory('Demand', [function () {
    var demandNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="scalable"><rect class="body"/></g><text class="label"/><g class="outPorts"/>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          size: { width: 90, height: 90 },
          type: 'devs.Model',
          outPorts: ['demand'],
          attrs: {
            '.': { magnet: false },
            '.body': {
              width: 200, height: 250,
              stroke: 'black'
            },
            rect: { fill: '#B2DF8A' },
            text: {
              fill: 'black',
              'pointer-events': 'none'
            },
            '.label': { 
              // text: cfg.name || 'Demand'
              text: 'Demand',
              'ref-x': 0.2,
              'ref-y': 0.2
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
          return new demandNode(cfg);
        }
      };
  }])
  .factory('Inflow', [function () {
    var inflowNode = joint.shapes.basic.Generic.extend(_.extend({}, 
      joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="scalable"><rect class="body"/></g><text class="label"/><g class="outPorts"/>',
        portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

        defaults: joint.util.deepSupplement({
          size: { width: 90, height: 90 },
          type: 'devs.Model',
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
              text: 'Inflow',
              'ref-x': 0.2,
              'ref-y': 0.2
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
          return new inflowNode(cfg);
        }
      };
  }])
  .factory('ModelService', ['Reservoir', 'Demand', 'Inflow', function (reservoir, demand, inflow) {
    var nodes = [];

    function out(m) {
      console.log(m);
    }

    var initial = {
      position: { x: 80, y: 50 } 
    };

    return {
      init: function(el) {
        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({ el: el, width: 650, height: 400, gridSize: 1, model: this.graph });
        
        window.graph = this.graph;

        // this.graph.on('all', function(link) {
        //   console.log(arguments);
        // });
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
            
            out(m);
          }

        });
      },

      addReservoir: function(cfg) {
        var newReservoir = reservoir.create({
            position: initial.position,
            size: { width: 90, height: 90 },
            inPorts: ['inflow'],
            outPorts: ['outflow', 'demand'],
            attrs: {
                '.label': { text: cfg.name || 'Reservoir', 'ref-x': 0.5, 'ref-y': 0.2 },
                rect: { fill: '#A6CEE3' },
                '.inPorts circle': { fill: '#FF7F00' },
                '.outPorts circle': { fill: '#FF7F00' }
            }
        });

        nodes.push(newReservoir);

        this.graph.addCell(newReservoir);

        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addDemand: function(cfg) {
        var newDemand = demand.create({
            position: initial.position
        });

        nodes.push(newDemand);

        this.graph.addCell(newDemand);

        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      addInflow: function(cfg) {
        var newInflow = inflow.create({
            position: initial.position
        });

        nodes.push(newInflow);

        this.graph.addCell(newInflow);

        initial.position = {x: initial.position.x+50, y: initial.position.y+50};
      },

      getNodes: function() {
        return nodes;
      },

      getGraph: function() {
        return this.graph;
      },

      getPaper: function() {
        return this.paper;
      }
    };
  }]);
