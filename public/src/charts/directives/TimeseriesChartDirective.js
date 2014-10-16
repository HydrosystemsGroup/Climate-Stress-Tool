
angular.module('charts')
  .directive('timeseriesChart', function() {
    function link(scope, element, attr) {
      var margin = {top: 20, right: 80, bottom: 30, left: 50},
          width = 1170 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

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
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

        svg.append("g")
            .attr("class", "y axis")
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(attr.labelY);
      
      scope.$watch('data', function(data) {
        if (data) {
          x.domain(d3.extent(data, scope.accessorX));
          y.domain([ attr.minY || d3.min(data, scope.accessorY), 
                     d3.max(data, scope.accessorY) ]);

          svg.select('.x.axis').call(xAxis);
          svg.select('.y.axis').call(yAxis);

          svg.selectAll(".line")
              .data([data])
            .enter()
              .append("path")
              .attr("class", "line");

          svg.selectAll(".line")
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
