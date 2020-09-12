// quick console test to make sure app.js is being picked up by index.html
console.log("Hello SVG!!!")

//defines margin parameter
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// appends svg to correct div
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // imports data
d3.csv("assets/data/data.csv").then(function(censusData) {

  console.log(censusData)

    censusData.forEach(function(data) {
      data.age = +data.age;
      data.income = +data.income;
    });


    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(censusData, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.income)])
      .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

// create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.income))
    .attr("class",'stateCircle')
    .attr("r", "13");

  
  // State
  var texts = chartGroup.append("g").selectAll("text")
  .data(censusData).enter().append("text")
  .text(function(data){return data.abbr})
  .attr("x", d => xLinearScale(d.age))
  .attr("y", d => yLinearScale(d.income)+6)
  .attr("class",'stateCircle')
  .attr("class",'stateText')

   // add axes formatting and such here 
       // Create axes labels
        chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
       .attr("class", "aText")
       .text("Y FOR NOW - CHANGE LATER");
 
     chartGroup.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
       .attr("class", "aText")
       .text("X FOR NOW - CHANGE LATER");


       var toolTip = d3.tip()
       .attr("class", "d3-tip")
       .html(function(data, index) {
         return (` Age: ${data.age}<br> Income: ${data.income}`);
       });
   
 
     chartGroup.call(toolTip);  
 
     circlesGroup.on("mouseover", function(data) {
       toolTip.show(data, this);
     })
     .on("mouseout", function(data, index) {
         toolTip.hide(data);
       });



   }).catch(function(error) {
     console.log(error)})