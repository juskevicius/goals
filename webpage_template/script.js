//controll the contents
var onOff1 = true;
var onOff2 = true;
var onOff3 = true;

function showAddForm() {
    document.getElementsByClassName("add-form")[0].style.display = "initial";
    document.getElementsByClassName("overlay")[0].style.display = "initial";
}

function showOfferGrp() {
    if (onOff2) {
        document.getElementsByClassName("offer-group")[0].style.display = "initial";
        document.getElementsByClassName("offer-i-score")[0].getElementsByTagName("input")[0].value = document.getElementsByClassName("i-score")[0].getElementsByTagName("input")[0].value;
        document.getElementsByClassName("offer-t-score")[0].getElementsByTagName("input")[0].value = document.getElementsByClassName("t-score")[0].getElementsByTagName("input")[0].value;
        document.getElementsByClassName("offer-comment")[0].getElementsByTagName("input")[0].value = document.getElementsByClassName("comment")[0].getElementsByTagName("input")[0].value;
    } else {
        document.getElementsByClassName("offer-group")[0].style.display = "none";
    }
    onOff2 = !onOff2;
}

function showAccGoals() {
    document.getElementsByClassName("acc-goals")[0].style.display = "initial";
    document.getElementsByClassName("overlay")[0].style.display = "initial";
}

function showOwnPndGoals() {
    document.getElementsByClassName("pnd-goals")[0].style.display = "initial";
    document.getElementsByClassName("overlay")[0].style.display = "initial";
}

function showPndResponse() {
    if (onOff1) {
        document.getElementsByClassName("pnd-my-response")[0].style.display = "initial";
    } else {
        document.getElementsByClassName("pnd-my-response")[0].style.display = "none";
    }
    onOff1 = !onOff1;
}

function showOffPndGoals() {
    document.getElementsByClassName("off-pnd-goals")[0].style.display = "initial";
    document.getElementsByClassName("overlay")[0].style.display = "initial";
}

function showPndOffer() {
    if (onOff3) {
        document.getElementsByClassName("pnd-my-offer")[0].style.display = "initial";
    } else {
        document.getElementsByClassName("pnd-my-offer")[0].style.display = "none";
    }
    onOff3 = !onOff3;
}

function hideForms() {
    document.getElementsByClassName("acc-goals")[0].style.display = "none";
    document.getElementsByClassName("pnd-goals")[0].style.display = "none";
    document.getElementsByClassName("off-pnd-goals")[0].style.display = "none";
    document.getElementsByClassName("add-form")[0].style.display = "none";
    document.getElementsByClassName("overlay")[0].style.display = "none";
}

function selectUnit(nr) {  
    document.getElementsByClassName("offer-group")[0].getElementsByClassName("dropdown-toggle")[nr].innerHTML = event.target.innerText;
    if (nr == document.getElementsByClassName("offer-elm").length - 1) {
        createNewOfferElm(nr);
    }
}

function createNewOfferElm(nr) {
    let offerToElm = document.getElementsByClassName("offer-elm")[0].cloneNode(true);
    offerToElm.getElementsByClassName("dropdown-toggle")[0].innerHTML = "Choose <span class='caret'></span>";
    offerToElm.getElementsByClassName("weight")[0].getElementsByTagName("input")[0].value = "";
    let units = offerToElm.getElementsByClassName("dropdown-menu")[0].getElementsByTagName("a");
    for (let i=0; i < units.length; i++) {
        units[i].setAttribute("onclick", "selectUnit(" + (nr + 1) + ")");
    }
    let offerButton = document.getElementsByClassName("offer-btn")[0];
    document.getElementsByClassName("offer-group")[0].getElementsByClassName("row")[0].insertBefore(offerToElm, offerButton);
}

// Building the gauge chart:

var perc = 0.75;
var targetVal = 0.85;
var width = document.getElementsByClassName("dashboard")[0].getElementsByClassName("col-xs-4")[0].offsetWidth - 4 - 20;

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
    .attr("x", width * 0.8 / 2 - fontSize * 3.5)
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

//
//Building the line chart

//raw data for line chart:
var rawLCData = [{date: '2018-01-20', value: 65}, {date: '2018-02-20', value: 62}, {date: '2018-03-20', value: 83}, {date: '2018-04-20', value: 70}, {date: '2018-05-20', value: perc * 100}];
//arrays for modified chart data and target data:
var LCData = [];
var tData = [];
for (var i in rawLCData) {
    LCData.push(
        {
            date: new Date(rawLCData[i].date),
            value: rawLCData[i].value
        }
    );
    tData.push(
        {
            date: new Date(rawLCData[i].date),
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
var y = d3.scaleLinear().rangeRound([height * 0.8, 0]);

var line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

//detect lowest and highest values and define axis limits
var minY = d3.min(LCData.concat(tData), d => d.value) * 0.95;
var maxY = d3.max(LCData.concat(tData), d => d.value);
maxY = maxY > 80 ? 100 : maxY * 1.1; 

x.domain(d3.extent(LCData, d => d.date));
y.domain([Math.floor(minY / 10) * 10, Math.ceil(maxY / 10) * 10]);

//add x-axis and ticks (months)
g.append("g")
.attr("transform", "translate(0," + height * 0.8 + ")")
.call(d3.axisBottom(x).ticks(LCData.length))
.attr("font-size", fontSize * 0.5 + "px");

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