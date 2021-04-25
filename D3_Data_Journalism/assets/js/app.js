var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
    top: 40,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create svgWrapper variable to hold the graph
var svgWrapper = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Variable for the chart group
var chartGroup = svgWrapper.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import CSV data
d3.csv("assets/data/data.csv").then(function (povertyData) {


    // Go through the data 
    povertyData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //Create xscales -- Similar to Day2 Activity 8
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(povertyData, d => d.poverty)])
        .range([0, width]);

    //Create xscales -- Similar to Day2 Activity 8
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(povertyData, d => d.healthcare)])
        .range([height, 0]);

    //Create axis -- Similar to Day2 Activity 8
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    //Add the axis to the chart area
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Circle for graph -- Similar to Day3 Activity 10
    var circlesGraph = chartGroup.selectAll("circle")
        .data(povertyData)
        .enter()
        .append("circle")

        //scales based on previous function, using arrow function
        .attr("cx", d => xScale(d.poverty))

        //scale based on pervious function, using arrow function
        .attr("cy", d => yScale(d.healthcare))

        .attr("r", "15")

        .attr("class", "stateCircle")

        //opacity of circles
        .attr("opacity", ".35");

    //select div for all of the states
    chartGroup.selectAll("div")
        .data(povertyData)
        .enter()
        .append("text")
        .text(function (d) {

            //abbreviation of the state
            console.log(d.abbr)
            return `${d.abbr}`;
        })
        .attr("x", function (d) {
            return xScale(d.poverty);
        })
        .attr("y", function (d) {
            return yScale(d.healthcare);
        })
        .attr("alignment-baseline", "central")
        .attr("class", "stateText");

    //Tool tip section -- Similar to Day3 Activity 6
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br> In Poverty (%): ${d.poverty}<br> Lacks Healthcare (%): ${d.healthcare}`);
        });

    //Create tooltip in the chart
    chartGroup.call(toolTip);

    // Click event listener
    circlesGraph.on("click", function (data) {
        toolTip.show(data, this);
    })
        //mouseout event listener
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Label the axis -- Similar to Day3 Activtiy 10
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

});

