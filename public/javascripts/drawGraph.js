var chartType="Bar";

var margin = {top: 20, right: 20, bottom: 250, left: 50},
winWidth = 500;
winHeight = 250 ;


var createLineGraph=function(subObject,multiline){
  if(subObject=='arableLandAfrica'){
    d3.select("#modalStatusGraph").html("");
    var mydiv = document.getElementById("myDiv");
    var hTag = document.createElement('h4');
    hTag.innerHTML = "Line Graph cannot be rendered for a non-time series based data";
    document.getElementById('content').appendChild(hTag);
    return;
  }
  var x = d3.time.scale()
  .range([0, winWidth]);

  var y = d3.scale.linear()
  .range([winHeight, 0]);

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
  .scale(x)
  .tickSize(-winHeight)
  .tickSubdivide(true)
  .orient("bottom")
  .tickFormat(d3.format("y"));

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(d3.format(".2s"));

  var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d) { console.log(d,x(d.xAxs)); return isNaN(x(d.xAxs))?  0 :  x(d.xAxs); })
  .y(function(d) { return y(d.yAxs); });

  d3.select("#modalStatusGraph").html("");

  var svg = d3.select("#modalStatusGraph").append("svg")
  .attr("width", winWidth + margin.left + margin.right)
  .attr("height", winHeight + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("json/graph_sprintStatus.json", function(error, data) {
    data=data[subObject];
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "xAxs"; }));

    var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {xAxs: d.xAxs, yAxs: +d[name]};
        })
      };
    });

    console.log(cities);
    x.domain(d3.extent(data, function(d) { return d.xAxs; }));

    y.domain([
      d3.min(cities, function(c) { return d3.min(c.values, function(v) {console.log(v.yAxs); return v.yAxs; }); }),
      d3.max(cities, function(c) { return d3.max(c.values, function(v) {console.log(v.yAxs); return v.yAxs; }); })
    ]);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + winHeight + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Value");

    var continentValue = svg.selectAll(".continentValue")
    .data(cities)
    .enter().append("g")
    .attr("class", "continentValue");

    continentValue.append("path")
    .attr("class", "line")
    .attr("d", function(d) { console.log(d.values); return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });
    if(multiline){
      continentValue.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 10]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.xAxs) + "," + y(d.value.yAxs) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
    }
  });
}

var createBarGraph=function(subObject,stackedChart){

  var x = d3.scale.ordinal()
  .rangeRoundBands([0, winWidth], 0.2,0.1);

  var y = d3.scale.linear()
  .range([winHeight, 0]);

  var color = d3.scale.ordinal()
  .range(["#f39c12", "#CA6924", "#F4D03F", "#E67E22", "#a05d56", "#F9BF3B", "#E29C45"]);
  //var color=d3.scale.category30();

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(d3.format(".2s"));

  var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
  d3.select("#modalStatusGraph").html("");

  var svg = d3.select("#modalStatusGraph").append("svg")
  .attr("width", winWidth + margin.left + margin.right)
  .attr("height", winHeight + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  ;

  d3.json("json/graph_sprintStatus.json", function(error, data) {
    data=data[subObject];
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "xAxs"; }));

    data.forEach(function(d) {
      var y0 = 0;
      d.state = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.state[d.state.length - 1].y1;
    });

    // data.sort(function(a, b) { return b.total - a.total; });

    x.domain(data.map(function(d) { return d.xAxs; }));
    y.domain([0,   Math.ceil(d3.max(data, function(d) { return (d.total); }))]);


    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + winHeight + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("dx", ".91em")
    .style("text-anchor", "end")
    .append("text");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Value");

    var xAxs = svg.selectAll(".xAxs")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) { return "translate(" + x(d.xAxs) + ",0)"; });

    xAxs.selectAll("rect")
    .data(function(d) { return d.state; })
    .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y1); })
    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
    .style("fill", function(d) { return color(d.name); })
    .on("mouseover", function(d) {
      div.transition()
      .duration(200)
      .style("opacity", 0.9);
      div	.html(parseFloat(d.y1)-parseFloat(d.y0))
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      div.transition()
      .duration(500)
      .style("opacity", 0);
    });
    ;
    if(stackedChart){
      var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
      .attr("x", winWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

      legend.append("text")
      .attr("x", winWidth - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
    }
  });
}

function drawGraph(subObject,condition){

  chartType=="Bar" ? createBarGraph(subObject,condition):createLineGraph(subObject,condition);
  // createBarGraph("arableLandContinentAggregate",true);

}
