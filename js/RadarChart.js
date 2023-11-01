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

  var axisAbbreviations = {
    "Score primaire": "S Prm",
    "Score collégial": "S Col",
    "Score actuel": "S Act",
    "Score en mathématiques": "M S",
    "Score en langue arabe": "A S",
    "Score en première langue": "F L S"
  };


axis.append("text")
  .attr("class", "legend")
  .style("font-size", "14px")
  .attr("dy", "0.35em")
  .attr("x", function(d, i) { return scale.range()[1] * 1.1 * Math.cos((i * 2 * Math.PI) / axes.length); })
  .attr("y", function(d, i) { return scale.range()[1] * 1.1 * Math.sin((i * 2 * Math.PI) / axes.length); })
  .text(function(d) {
    // Use abbreviations for the axis labels
    return axisAbbreviations[d] || d;
  });

// Draw concentric circles as grid lines
var numGridLevels = 5; // Number of concentric circles
for (var i = 0; i < numGridLevels; i++) {
  var gridRadius = radius * ((i + 1) / numGridLevels);
  Radarsvg.append("circle")
    .attr("class", "grid-circle")
    .attr("r", gridRadius)
    .style("stroke", "#ccc")
    .style("stroke-width", "1px")
    .style("fill", "none");
}

// Draw radial lines as grid lines
var numRadialLines = axes.length; // Number of radial lines
axis.append("line")
  .attr("class", "grid-line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", function(d, i) {
    return scale.range()[1] * Math.cos((i * 2 * Math.PI) / numRadialLines);
  })
  .attr("y2", function(d, i) {
    return scale.range()[1] * Math.sin((i * 2 * Math.PI) / numRadialLines);
  })
  .style("stroke", "#ccc")
  .style("stroke-width", "1px")
  .style("fill", "none");

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
  var student = Radarsvg.append("g").attr("class", "student").attr("fill", colorScale(selectedStudentName));

  // Rotate the inside lines representing the scores
  var rotationAngle = -90; // Specify the rotation angle in degrees
  var rotatedLine = d3.lineRadial()
    .radius(function(d) { return scale(d.value); })
    .angle(function(d, i) {
      var angle = (i * 2 * Math.PI) / axes.length;
      return angle + (rotationAngle * Math.PI / 180); // Convert degrees to radians
    })
    .curve(d3.curveLinearClosed);

  student.append("path")
    .attr("class", "line")
    .attr("d", rotatedLine(selectedStudentData.axes))
    .style("opacity", 0.5)
    .style("stroke", "#000")
    .style("stroke-width", "2px"); ;

    
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
  .style("fill", "#333") ;// Color of the axis text
  // .text(function(d) {
  //   // Use abbreviations if available, otherwise use the original name
  //   return axisAbbreviations[d] || d;
  // });
  
  
    student.append("text")
    .attr("class", "legend")
    .style("font-size", "16px")
    .attr("dy", "0.35em")
    .attr("x", -50)
    .attr("y", -radius - 20)  // Adjust the position of the student name
    .text(selectedStudentData.className)
    .style("fill", colorScale(selectedStudentName));

    
});

