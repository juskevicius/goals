window.addEventListener('load', function() {

var perc = document.getElementsByClassName("gauge-chart")[0].getAttribute("current") / 100;
var targetVal = document.getElementsByClassName("gauge-chart")[0].getAttribute("targscore") / 100;

var width = document.getElementsByClassName("l-main1")[0].offsetWidth - 6;

var height = width * 0.65;
var fontSize = width * 0.064;
var deg180 = 0.5 * Math.PI;
var theGauge = d3.arc()
    .startAngle(-0.5 * Math.PI)
    .innerRadius(width / 2 * 0.5)
    .outerRadius(width / 2 * 0.7)
    .cornerRadius(6);
var theTarget = d3.arc()
    .startAngle((2 * targetVal - 1) * deg180)
    .endAngle((2 * targetVal - 1) * deg180 + 0.04)
    .innerRadius(width / 2 * 0.48)
    .outerRadius(width / 2 * 0.72);
var svg = d3.select(".gauge-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "white")
    .append("g")
    .attr("transform", "translate(" + width / 2 + ", " + (height * 0.9) + ")");
    //add labels on the top-right and top-left corners
    svg.append('text')
    .attr("x", -width * 0.8 / 2)
    .attr("y", -height * 0.8 + fontSize)
    .attr("font-size", fontSize)
    .style("fill", "#606060")
    .transition()
    .duration(750)
    .text("Current");
    svg.append('text')
    .attr("x", -width * 0.8 / 2 + fontSize)
    .attr("y", -height * 0.8 + fontSize * 2.2)
    .attr("font-size", fontSize)
    .style("fill", "#606060")
    .transition()
    .duration(750)
    .text(Math.round(perc * 100) + "%");
    svg.append('text')
    .attr("x", width * 0.8 / 2 - fontSize * 3)
    .attr("y", -height * 0.8 + fontSize)
    .attr("font-size", fontSize)
    .style("fill", "#606060")
    .transition()
    .duration(750)
    .text("Target");
    svg.append('text')
    .attr("x", width * 0.8 / 2 - fontSize * 2.75)
    .attr("y", -height * 0.8 + fontSize * 2.2)
    .attr("font-size", fontSize)
    .style("fill", "#606060")
    .transition()
    .duration(750)
    .text(Math.round(targetVal * 100) + "%");
//add grey backgound
var background = svg.append("path")
    .datum({endAngle: deg180})
    .attr("fill", "#e5e5e5")
    .attr("d", theGauge);  
//add foreground
var foreground = svg.append("path")
    .datum({endAngle: (2 * 0 - 1) * deg180})
    .attr("fill", "#515ad8")
    .attr("d", theGauge)
    .transition()
    .duration(750)
    .attrTween("d", arcTween((2 * perc - 1) * deg180));
//animate foreground
function arcTween(newAngle) {
    return function(d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function(t) {
            d.endAngle = interpolate(t);
            return theGauge(d);
        };
    };
}
//add target
var targetArc = svg.append("path")
    .attr("fill", "#e5e5e5")
    .attr("d", theTarget)
    .transition()
    .duration(750)
    .attr("fill", "#214566")
    .attr("d", theTarget);
//animate current value
var middleCount = svg.append('text')
    .attr("class", "middle-text")
    .attr("text-anchor", "middle")
    .attr("font-size", fontSize * 2)
    .transition()
    .duration(750)
    .tween("text", function() {
        var that = d3.select(this),
            i = d3.interpolateNumber(0, perc);
        return function(t) { that.text( d3.format(".0%")(i(t))); };
    });
  });
