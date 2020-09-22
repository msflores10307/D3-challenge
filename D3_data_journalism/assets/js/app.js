// quick console test to make sure app.js is being picked up by index.html
console.log("Hello SVG!!!")

//defines margin parameter
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 10,
  right: 30,
  bottom: 50,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// appends svg to correct div
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// appends group to build plot object
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // imports data
d3.csv("assets/data/data.csv").then(function(censusData) {

  console.log(censusData)

  // converts imported data to integers
    censusData.forEach(function(data) {
      data.age = +data.age;
      data.healthcare = +data.healthcare;
    });

  // creates scaling functions for x and y
    var xLinearScale = d3.scaleLinear()
      .domain([30, d3.max(censusData, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);

  
    
    
  // appends bottom axis label 
    var bottomAxis = d3.axisBottom(xLinearScale);
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  // appends left axis label
    var leftAxis = d3.axisLeft(yLinearScale);
    chartGroup.append("g")
      .call(leftAxis);

// create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("class",'stateCircle')
    .attr("r", "11");

  
  // State label
  var texts = chartGroup.append("g").selectAll("text")
  .data(censusData).enter().append("text")
  .text(function(data){return data.abbr})
  .attr("x", d => xLinearScale(d.age))
  .attr("y", d => yLinearScale(d.healthcare)+4) // + 6
  .attr("class",'stateCircle')
  .attr("class",'stateText').attr("font-size","10")

  // Creates axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "aText").attr("class","h2")
  .text("Healthcare");

    
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText").attr("class","h2")
    .text("Age");

  // initializes tooltip
  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .html(function(data, index) {
    return (`${data.abbr} <br> Median Age: ${data.age}<br> Healthcare: ${data.healthcare}`);
  });

  // calls tooltip
  chartGroup.call(toolTip);  
  
  // creates listener for tool tip mouse events
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });



}).catch(function(error) {
  console.log(error)})