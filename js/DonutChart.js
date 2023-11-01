// Data for the donut chart
var schoolTypeAreaData = [
    {
        type: "Public",
        area: "Rural",
        count: 20
    }, {
        type: "Public",
        area: "Urban",
        count: 10
    }, {
        type: "Private",
        area: "Rural",
        count: 5
    }, {
        type: "Private",
        area: "Urban",
        count: 5
    }
];


// Set up the donut chart dimensions and radius
var donutWidth = 100;
var donutRadius = Math.min(width, height) / 3;
var donutInnerRadius = donutRadius - donutWidth;

// Create a color scale
var donutColor = d3.scaleOrdinal().domain(["Public Rural", "Public Urban", "Private Rural", "Private Urban"]).range(["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"]);

// Create arc and pie generators for the donut chart
var donutArc = d3.arc().outerRadius(donutRadius).innerRadius(donutInnerRadius);

var donutPie = d3.pie().sort(null).value(function (d) {
    return d.count;
});

// Append an SVG element for the donut chart
var donutSvg = d3.select("#schoolTypeAreaDistribution")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Generate the donut chart segments
var donutPath = donutSvg.selectAll("path")
                .data(donutPie(schoolTypeAreaData)).enter()
                .append("path")
                .attr("d", donutArc)
                .style("fill", function (d) {
                    return donutColor(d.data.type + " " + d.data.area);
                }).style("stroke", "white")
                .style("stroke-width", 2);

// Add labels to the donut chart segments
var donutLabels = donutSvg.selectAll("text")
                .data(donutPie(schoolTypeAreaData)).enter()
                .append("text")
                .attr("transform", function (d) {
                    var centroid = donutArc.centroid(d);
                // Make the percentage display slightly above the center of the donut segment
                    centroid[1] -= 10;
                    return "translate(" + centroid + ")";
                }).attr("dy", ".35em")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "20px")
                .text(function (d) { // Calculate percentage and display it
                    var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
                    return percentage.toFixed(1) + "%";
                });

// Define the legend data (same as your schoolTypeAreaData)
var legendData = [
    { type: "Public", area: "Rural" },
    { type: "Public", area: "Urban" },
    { type: "Private", area: "Rural" },
    { type: "Private", area: "Urban" }
];

// Define the legend colors
var legendColors = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"];

// Define the legend size and position
var legendRectSize = 18;
var legendSpacing = 4;
var legendX = width / 2 - donutRadius +10;
var legendY = height / 2 - donutRadius;

// Append an SVG element for the legend
var legendSvg = donutSvg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + legendX + "," + legendY + ")");

// Create legend items (rectangles and text)
var legendItems = legendSvg.selectAll(".legend-item")
    .data(legendData)
    .enter().append("g")
    .attr("class", "legend-item")
    .attr("transform", function(d, i) {
        var translateY = i * (legendRectSize + legendSpacing);
        return "translate(0," + translateY + ")";
    });

// Add legend rectangles
legendItems.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", function(d, i) {
        return legendColors[i];
    });

// Add legend text
legendItems.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize / 2)
    .attr("dy", "0.35em")
    .text(function(d) {
        return d.type + " " + d.area;
    })
    .style("font-size", "12px")
    .style("fill", "#000"); // Set legend text color
