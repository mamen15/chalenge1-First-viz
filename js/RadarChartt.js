// Define chart dimensions and margins
var margin = { top: 50, right: 50, bottom: 50, left: 50 };
var width = 500 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

// Define the radius of the spider chart
var radius = Math.min(width, height) / 2;
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create a D3.js scale for the axes
var scale = d3.scaleLinear().range([0, radius]);

// Create the SVG container
var Radarsvg = d3.select("#spider-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

// Define the domains for the axes
var axes = data[0].axes.map(function(d) { return d.axis; });
scale.domain([0, d3.max(data, function(d) {
  return d3.max(d.axes, function(axis) {
    return axis.value;
  });
})]);
var select = d3.select("#student-select");
// Create a function to draw the spider chart
var line = d3.lineRadial()
  .radius(function(d) { return scale(d.value); })
  .angle(function(d, i) { return (i * 2 * Math.PI) / axes.length; })
  .curve(d3.curveLinearClosed);

// Draw the axes
var axis = Radarsvg.selectAll(".axis")
  .data(axes)
  .enter()
  .append("g")
  .attr("class", "axis");

axis.append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", function(d, i) { return scale.range()[1] * Math.cos((i * 2 * Math.PI) / axes.length); })
  .attr("y2", function(d, i) { return scale.range()[1] * Math.sin((i * 2 * Math.PI) / axes.length); })
  .attr("class", "line");

axis.append("text")
  .attr("class", "legend")
  .style("font-size", "14px")
  .attr("dy", "0.35em")
  .attr("x", function(d, i) { return scale.range()[1] * 1.1 * Math.cos((i * 2 * Math.PI) / axes.length); })
  .attr("y", function(d, i) { return scale.range()[1] * 1.1 * Math.sin((i * 2 * Math.PI) / axes.length); })
  .text(function(d) { return d; });


select.selectAll("option")
  .data(data)
  .enter().append("option")
  .attr("value", function(d) { return d.className; })
  .text(function(d) { return d.className; });

// Event listener for dropdown change
select.on("change", function() {
  var selectedStudentName = d3.select(this).property("value");

  // Find the selected student's data
  var selectedStudentData = data.find(function(d) {
    return d.className === selectedStudentName;
  });

  // Clear previous chart content
  Radarsvg.selectAll(".student").remove();

  // Draw the chart for the selected student
  var student = Radarsvg.append("g").attr("class", "student").attr("fill", colorScale(selectedStudentName));;

  var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


  student.append("path")
    .attr("class", "line")
    .attr("d", line(selectedStudentData.axes))
    .on("mouseover", function(d) {
        var tooltipText = "Axis Value: " + d.value; // Customize this as needed
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(tooltipText)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });;
    
    student.select(".line")
      .transition()
      .duration(1000) // Duration of the transition in milliseconds
      .attr("d", line(selectedStudentData.axes));
    
    // Inside the event listener for the dropdown change, add the following animation:
    student.style("opacity", 0)
            .transition()
            .duration(1000) // Duration of the animation in milliseconds
            .style("opacity", 1);
    
    // Styling the axis lines
    axis.select(".line")
    .style("stroke", "#ccc") // Color of the axis lines
    .style("stroke-width", "2px"); // Width of the axis lines
      
    // Styling the axis text
    axis.select(".legend")
    .style("fill", "#333"); // Color of the axis text
        
    student.append("text")
    .attr("class", "legend")
    .style("font-size", "16px")
    .attr("dy", "0.35em")
    .attr("x", 0)
    .attr("y", -radius - 20)  // Adjust the position of the student name
    .text(selectedStudentData.className)
    .style("fill", colorScale(selectedStudentName));

});

