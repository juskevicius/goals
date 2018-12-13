window.addEventListener('load', function() {
  
  let dates = document.getElementsByClassName("line-chart")[0].getAttribute("dates").split(",");
  let values = document.getElementsByClassName("line-chart")[0].getAttribute("values").split(",");
  var width = document.getElementsByClassName("r-main1")[0].offsetWidth;
  var height = width * 0.65;
  var targetVal = document.getElementsByClassName("line-chart")[0].getAttribute("targscore") / 100;
  var fontSize = width * 0.064;
  
  //arrays for modified chart data and target data:
  var LCData = [];
  var tData = [];
  for (var i in dates) {
      LCData.push(
          {
              date: new Date(dates[i]),
              value: values[i]
          }
      );
      tData.push(
          {
              date: new Date(dates[i]),
              value: targetVal * 100 
          }
      );
  }

  var svg = d3.select('.line-chart')
      .append('svg')
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "white");
  var g = svg.append("g")
      .attr("transform", 
      "translate(" + width * 0.1 + "," + height * 0.1 + ")"
  );
  var x = d3.scaleTime().rangeRound([0, width * 0.8]);
  var y = d3.scaleLinear().rangeRound([height * 0.7, 0]);
  var line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));
  //detect lowest and highest values and define axis limits
  var maxY = d3.max(LCData, d => +d.value) * 1.1;
  var minY = d3.min(LCData, d => +d.value) * 0.9;
  x.domain(d3.extent(LCData, d => d.date));
  y.domain([Math.floor(minY / 10) * 10, Math.ceil(maxY / 10) * 10]);
    
  //add x-axis and ticks (months)
  g.append("g")
  .attr("transform", "translate(0," + height * 0.7 + ")")
  .call(d3.axisBottom(x).ticks(LCData.length))
  .selectAll("text")
    .attr("font-size", fontSize * 0.4 + "px")
    .style("text-anchor", "end")
    .attr("dy", "5px")
    .attr("dx", "-8px")
    .attr("transform", "rotate(-35)");
  //add y-axis and ticks (5 ticks)
  g.append("g")
  .call(d3.axisLeft(y).ticks(5))
  .attr("font-size", fontSize * 0.5 + "px")
  /*.append("text")
  .attr("fill", "black")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Units")*/;
  //draw a line corresponding the data
  g.append("path")
  .datum(LCData)
  .attr("fill", "none")
  .attr("stroke", "#515ad8")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 5.5)
  .attr("d", line);
  //draw a line corresponding the target
  g.append("path")
  .datum(tData)
  .attr("fill", "none")
  .attr("stroke", "#214566")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 2)
  .attr("d", line);
  g.append("text")
  .attr("transform", "translate(" + width * 0.71  + "," + (y(tData[0].value) - 6) + ")")
  .attr("font-size", fontSize * 0.5 + "px")
  .style("fill", "#606060")
  .text("Target");
  //tooltips:
  var bisectDate = d3.bisector(d => d.date).left;
  var focus = svg.append("g")
      .style("display", "none");
  // append the circle at the intersection
  focus.append("circle")
  .attr("class", "y")
  .style("fill", "none")
  .style("stroke", "blue")
  .attr("r", 4);
  //append text above the intersection
  focus.append("text")
  .attr("y", height * -0.05)
  .attr("x", width * -0.0175)
  .attr("font-size", fontSize * 0.5 + "px");
  
  if (LCData.length > 1) {
  // append the rectangle to capture mouse
  svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", function() { focus.style("display", null); })
  .on("mouseout", function() { focus.style("display", "none"); })
  .on("mousemove", mousemove);  
    function mousemove() {
        var xPosition = d3.mouse(this)[0] - width * 0.1;
        xPosition = xPosition > (width * 0.8) ? width * 0.8 : xPosition; 
        var x0 = x.invert(xPosition),
        i = bisectDate(LCData, x0, 1),
        d0 = LCData[i - 1],
        d1 = LCData[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.select("circle.y")
        .attr("transform", "translate(" + (x(d.date) + width * 0.1) + "," + (y(d.value) + height * 0.1) + ")");
        focus.select("text")
        .text( () => d.value)
        .style("fill", "#606060")
        .attr("transform", "translate(" + (x(d.date) + width * 0.1) + "," + (y(d.value) + height * 0.1) + ")");;
    }
  }
  
});