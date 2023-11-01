// Load data from CSV file
d3.csv("../App/data/data_csv.csv").then(function(data) {
    // Extract numeric variables for the correlation heatmap
    var numericData = data.map(function(d) {
        return [+d['Score primaire'], +d['Score collégial'], +d['Score actuel'], +d['score en mathématiques'], +d['score en langue arabe']];
    });

    // Define the size of the heatmap
    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Create SVG element
    var svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the color scale for the heatmap
    var colorScale = d3.scaleLinear()
        .domain([d3.min(numericData.flat()), d3.max(numericData.flat())])
        .range(["white", "steelblue"]);

    // Create heatmap cells
    var cells = svg.selectAll(".cell")
        .data(numericData)
        .enter().append("g")
        .attr("class", "row")
        .selectAll(".cell")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return i * (width / numericData[0].length); })
        .attr("y", function(d, i, j) { return j * (height / numericData.length); })
        .attr("width", width / numericData[0].length)
        .attr("height", height / numericData.length)
        .style("fill", function(d) { return colorScale(d); });

    // Add X-axis labels
    var xLabels = svg.selectAll(".xLabel")
        .data(["Score primaire", "Score collégial", "Score actuel", "Score en mathématiques", "Score en langue arabe"])
        .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * (width / numericData[0].length) + (width / numericData[0].length) / 2; })
        .attr("y", height + 20)
        .style("text-anchor", "middle");

    // Add Y-axis labels
    var yLabels = svg.selectAll(".yLabel")
        .data(data.map(function(d, i) { return "Row " + (i + 1); }))
        .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", -30)
        .attr("y", function(d, i) { return i * (height / numericData.length) + (height / numericData.length) / 2; })
        .style("text-anchor", "middle")
        .attr("transform", "rotate(-90)");
});
