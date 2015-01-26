
angular.module('cst.charts')
  .directive('timeseriesChart', function() {
    function link(scope, element, attr) {
      var div = d3.select(element[0]);

      var bbox = div.node().getBoundingClientRect();

      var margin = {top: 20, right: 80, bottom: 30, left: 50},
          width = (bbox.width || 800) - margin.left - margin.right,
          height = (bbox.height || 300) - margin.top - margin.bottom;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(scope.accessorX(d)); })
          .y(function(d) { return y(scope.accessorY(d)); });

      var svg = d3.select(element[0]).append('svg')
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")");

      g.append("g")
          .attr("class", "y axis")
        .append("text")
          // .attr("transform", "rotate(-90)")
          // .attr("y", 6)
          .attr("dy", "-0.6em")
          .attr("dx", -margin.left)
          .style("text-anchor", "start")
          .text(attr.labelY);
      
      scope.$watch('data', function(data) {
        if (data) {
          x.domain(d3.extent(data, scope.accessorX));
          y.domain([ attr.minY || d3.min(data, scope.accessorY), 
                     d3.max(data, scope.accessorY) ]);

          g.select('.x.axis').call(xAxis);
          g.select('.y.axis').call(yAxis);

          g.selectAll(".line")
              .data([data])
            .enter()
              .append("path")
              .attr("class", "line");

          g.selectAll(".line")
              .attr("d", line);  
        }
      }, true);
    }

    return {
      link: link,
      restrict: 'E',
      scope: {
        data: '=',
        accessorY: '&',
        accessorX: '&'
      }
    };
  });
