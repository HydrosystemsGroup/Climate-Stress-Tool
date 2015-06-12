
angular.module('cst.charts')
  .directive('timeseriesChart', ['$window', function($window) {
    function link(scope, element, attr) {
      console.log('timeseriesChart');
      var div = d3.select(element[0]),
          margin = {top: 20, right: 30, bottom: 30, left: 50},
          width = 800,
          height = 300 - margin.top - margin.bottom;

      scope.onResizeFunction = function() {
        var bbox = element[0].parentNode.getBoundingClientRect();
        width = (bbox.width || 800) - margin.left - margin.right;
        // height = (bbox.height || 300) - margin.top - margin.bottom;
        console.log('width: ' + width);
        render();
      };

      angular.element($window).bind('resize', function() {
        scope.onResizeFunction();
        scope.$apply();
      });

      // var bbox = div.node().getBoundingClientRect();

      var svg = d3.select(element[0]).append('svg');

      var x = d3.time.scale();

      var y = d3.scale.linear();

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d[scope.accessorX]); })
          .y(function(d) { return y(d[scope.accessorY]); });

      //     .attr("width", width + margin.left + margin.right)
      //     .attr("height", height + margin.top + margin.bottom);

      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")");

      g.append("g")
          .attr("class", "y axis");

      var yLabel = g.select('.y.axis').append("text")
          .attr("dy", "-0.6em")
          .attr("dx", -margin.left)
          .style("text-anchor", "start");

      scope.$watchCollection('[data, accessorY]', function() {
        // console.log('timeseriesChart: watcher', arguments);
        render();
      });

      scope.onResizeFunction();

      function render() {
        svg.attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        x.range([0, width]);
        y.range([height, 0]);

        yLabel
          .text(scope.labelY);

        if (scope.data && scope.accessorY) {
          x.domain(d3.extent(scope.data, function(d) { return d[scope.accessorX]; }));
          var y_extent = d3.extent(scope.data, function(d) { return d[scope.accessorY]; });
          y.domain([ scope.minY || y_extent[0], y_extent[1]]);

          g.select('.x.axis').call(xAxis);
          g.select('.y.axis').call(yAxis);

          g.selectAll(".line")
              .data([scope.data])
            .enter()
              .append("path")
              .attr("class", "line");

          g.selectAll(".line")
              .attr("d", line);
        } else {
          x.domain([null, null]);
          y.domain([null, null]);
          g.select('.x.axis').call(xAxis);
          g.select('.y.axis').call(yAxis);
          g.selectAll(".line").remove();
        }
      }
    }

    return {
      link: link,
      restrict: 'E',
      scope: {
        data: '=',
        accessorY: '@',
        accessorX: '@',
        labelY: '@',
        minY: '='
      }
    };
  }]);
