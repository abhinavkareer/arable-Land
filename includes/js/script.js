
var createBarGraphUsingTemplate=function(subObject,fileName,targetDiv){

var margin = {top: 20, right: 20, bottom: 70, left: 80},
    width = 1800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(24);
    d3.select("#content").html("");

      d3.json(fileName,function(error, data) {
  temp=data[subObject];
  data=temp.arr;

  var xAxisProp=temp.xAxis;
  var yAxisProp=temp.yAxis;

  if (error) throw error;
  var svg = d3.select(targetDiv).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>"+d[xAxisProp]+":</strong> <span style='color:red'>" + parseFloat(d[yAxisProp]).toFixed(2) + "</span>";
        });
        svg.call(tip);
  x.domain(data.map(function(d) { return d[xAxisProp]; }));
  y.domain([0,  Math.ceil(d3.max(data, function(d) { return parseFloat(d[yAxisProp]); }))]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")



      .call(xAxis)
      .selectAll("text")
      .style("text-anchor","end")
      .attr("transform","rotate(-30)")
      .append("text")
      .attr("y", 10)
      .attr("dy", ".91em")
      .style("text-anchor", "end")
      .text("");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("%");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("data-toggle","tooltip")
      .attr("data-placement","top")
      .attr("title",function(d) { return d[xAxisProp]+":"+d[yAxisProp];})
      .attr("x", function(d) { return x(d[xAxisProp]); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d[yAxisProp]); })
      .attr("height", function(d) { return height - y(d[yAxisProp]);
      })
      .on('mouseover', tip.show)
  .on('mouseout', tip.hide)

});

}
