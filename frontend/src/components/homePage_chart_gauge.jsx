import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';


export default class GaugeChart extends React.Component {
  
  componentDidMount() {
    this.draw(this.props, 750);
  }

  componentDidUpdate(prevProps) {
    this.draw(this.props, 0);
  }

  draw = (props, duration) => {
    d3.select('.gauge-chart > *').remove();
    const currentScore = props.history.reduce((prev, curr) => { return (prev.date > curr.date) ? prev : curr; }).value;
    const perc = currentScore / 100;
    const targetVal = props.targScore / 100;
    const width = ReactDOM.findDOMNode(this).offsetWidth;
    const height = width * 0.65;
    const fontSize = width * 0.064;
    const deg180 = 0.5 * Math.PI;
    const theGauge = d3.arc()
        .startAngle(-0.5 * Math.PI)
        .innerRadius(width / 2 * 0.5)
        .outerRadius(width / 2 * 0.7)
        .cornerRadius(6);
    const theTarget = d3.arc()
        .startAngle((2 * targetVal - 1) * deg180)
        .endAngle((2 * targetVal - 1) * deg180 + 0.04)
        .innerRadius(width / 2 * 0.48)
        .outerRadius(width / 2 * 0.72);
    const svg = d3.select(".gauge-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "white")
        .append("g")
        .attr("transform", "translate(" + width / 2 + ", " + (height * 0.9) + ")");
        //add labels on the top-right and top-left corners
      svg.append('text') // Current
        .attr("x", -width * 0.8 / 2)
        .attr("y", -height * 0.8 + fontSize)
        .attr("font-size", fontSize)
        .on('click', (event = new Event('fake')) => props.toggleDisplayForm("formCurrentScore", event))
        .style("fill", "#606060")
        .transition()
        .duration(duration)
        .text("Current");
      svg.append('text') // score, % (current)
        .attr("x", -width * 0.8 / 2 + fontSize)
        .attr("y", -height * 0.8 + fontSize * 2.2)
        .attr("font-size", fontSize)
        .on('click', (event = new Event('fake')) => props.toggleDisplayForm("formCurrentScore", event))
        .style("fill", "#606060")
        .transition()
        .duration(duration)
        .text(Math.round(perc * 100) + "%");
      svg.append('text') // Target
        .attr("x", width * 0.8 / 2 - fontSize * 3)
        .attr("y", -height * 0.8 + fontSize)
        .attr("font-size", fontSize)
        .style("fill", "#606060")
        .transition()
        .duration(duration)
        .text("Target");
      svg.append('text') // score, % (target)
        .attr("x", width * 0.8 / 2 - fontSize * 2.75)
        .attr("y", -height * 0.8 + fontSize * 2.2)
        .attr("font-size", fontSize)
        .style("fill", "#606060")
        .transition()
        .duration(duration)
        .text(Math.round(targetVal * 100) + "%");
      svg.append("path") // add grey backgound
        .datum({endAngle: deg180})
        .attr("fill", "#e5e5e5")
        .attr("d", theGauge);  
      svg.append("path") // add foreground
        .datum({endAngle: (2 * 0 - 1) * deg180})
        .attr("fill", "#515ad8")
        .attr("d", theGauge)
        .transition()
        .duration(duration)
        .attrTween("d", arcTween((2 * perc - 1) * deg180));
    //animate foreground
    function arcTween(newAngle) {
        return (d) => {
            const interpolate = d3.interpolate(d.endAngle, newAngle);
            return (t) => {
                d.endAngle = interpolate(t);
                return theGauge(d);
            };
        };
    }
      svg.append("path") // add target to the gauge
        .attr("fill", "#e5e5e5")
        .attr("d", theTarget)
        .transition()
        .duration(duration)
        .attr("fill", "#214566")
        .attr("d", theTarget);
      svg.append('text') // animate current value
        .attr("class", "middle-text")
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize * 2)
        .on('click', (event = new Event('fake')) => props.toggleDisplayForm("formCurrentScore", event))
        .transition()
        .duration(duration)
        .tween("text", function() {
            const that = d3.select(this),
                i = d3.interpolateNumber(0, perc);
            return (t) => { that.text( d3.format(".0%")(i(t))); };
        });
  }

  render() {
    return (
      <div className="gauge-chart">
      </div>
    );
  }

}