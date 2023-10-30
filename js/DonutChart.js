// Data for the donut chart
var data = [
    { type: "Public", area: "Rural", count: 20 },
    { type: "Public", area: "Urban", count: 10 },
    { type: "Private", area: "Rural", count: 5 },
    { type: "Private", area: "Urban", count: 5 }
];
// Get the width and height of the container element
var containerWidth = document.getElementById("schoolTypeAreaDistribution").offsetWidth;
var containerHeight = containerWidth; // Make the chart square

// Set the radius based on the container size
var radius = Math.min(containerWidth, containerHeight) / 2;

// Set the dimensions and radius of the donut chart
var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

// Create a color scale
var color = d3.scaleOrdinal()
    .domain(["Public Rural", "Public Urban", "Private Rural", "Private Urban"])
    .range(["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"]);

// Create an arc generator
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

// Create a pie generator
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

// Append an SVG element to the chart div
var svg = d3.select("#schoolTypeAreaDistribution")
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Generate the donut chart segments
var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");
    var path = g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.type + " " + d.data.area); })
    .on("mouseover", function(d) {
        // Show tooltip with the number of students when hovering over a segment
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Number of Students: " + d.data.count)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        // Hide the tooltip when mouseout
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// Append paths for the donut chart segments
// g.append("path")
//     .attr("d", arc)
//     .style("fill", function(d) { return color(d.data.type + " " + d.data.area); });

// Add labels to the donut chart segments
g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.data.type + " " + d.data.area; });

// Add a legend
var legend = svg.selectAll(".legend")
    .data(data)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width / 1 - 22)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return color(d.type + " " + d.area); });

legend.append("text")
    .attr("x", width / 1 - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d.type + " " + d.area; });

    // Create a tooltip div element
var tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);