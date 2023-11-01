// Load the CSV data
d3.csv("../App/data/data_csv.csv").then(function(data) {
    // Log the loaded data to verify it's correctly loaded
    console.log(data);

    // Call the data processing function
    processData(data);
});

// Function to process the data
function processData(data) {
    // Check if the data is an array
    if (Array.isArray(data)) {
        // Convert numeric values to numbers
        data.forEach(function(d) {
            d.Age = +d.Age;
            d["Score primaire"] = +d["Score primaire"];
        });

        // Call your data visualization function here, passing the data array
        createBarChart(data);
        createScatterPlot(data);
    } else {
        console.error("The loaded data is not an array.");
    }
}

// Function to create the bar chart
function createBarChart(data) {
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var width = 800 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#chart") // Select the SVG element by ID
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(function(d) { return d.Age; }));

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d["Score primaire"]; })]);

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Age); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d["Score primaire"]); })
        .attr("height", function(d) { return height - y(d["Score primaire"]); })
        .attr("fill", "steelblue"); // Add fill color

    // X-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .style("text-anchor", "middle")
        .text("Age");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Score Primaire");
}

// Ensure you have an HTML element with the ID "chart" where the SVG will be rendered.
// Function to create the scatter plot
function createScatterPlot(data) {
    var margin = { top: 20, right: 20, bottom: 50, left: 50 };
    var width = 400 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#scatter-chart") // Select the SVG element by ID
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Score primaire"])])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Score collégial"])])
        .range([height, 0]);

    // Create the x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -10)
        .style("text-anchor", "end")
        .text("Score primaire");

    // Create the y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Score collégial");

    // Create circles for the data points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d["Score primaire"]))
        .attr("cy", d => yScale(d["Score collégial"]))
        .attr("r", 5)
        .style("fill", "steelblue");

    // Add tooltips for each data point
    svg.selectAll("circle")
        .on("mouseover", function(d) {
            d3.select(this).attr("r", 8); // Enlarge the circle on hover
            var tooltip = d3.select("#scatter-tooltip");
            tooltip.style("left", (d3.event.pageX + 10) + "px");
            tooltip.style("top", (d3.event.pageY - 30) + "px");
            tooltip.select("#primary").text("Primary Score: " + d["Score primaire"]);
            tooltip.select("#collegial").text("Collegial Score: " + d["Score collégial"]);
            tooltip.style("display", "block");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 5); // Shrink the circle on mouseout
            d3.select("#scatter-tooltip").style("display", "none");
        });

    // Add a tooltip div
    var tooltip = d3.select("body").append("div")
        .attr("id", "scatter-tooltip")
        .style("position", "absolute")
        .style("display", "none");

    tooltip.append("div").attr("id", "primary");
    tooltip.append("div").attr("id", "collegial");
}
