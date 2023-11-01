// Data for the donut chart
var donutData = [
    { type: "Public", area: "Rural", count: 20 },
    { type: "Public", area: "Urban", count: 10 },
    { type: "Private", area: "Rural", count: 5 },
    { type: "Private", area: "Urban", count: 5 }
];


var margin = { top: 10, right: 30, bottom: 30, left: 40 };
var width = document.getElementById("ageDistribution").offsetWidth;
var height = width; 
// append the svg object to the body of the page
var svg = d3.select("#ageDistribution")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the width and height of the container element for the donut chart
var donutContainerWidth = document.getElementById("schoolTypeAreaDistribution").offsetWidth;
var donutContainerHeight = donutContainerWidth; // Make the chart square

// Set the radius based on the container size for the donut chart
var donutRadius = Math.min(donutContainerWidth, donutContainerHeight) / 2;

// Create a color scale for the donut chart
var donutColor = d3.scaleOrdinal()
    .domain(["Public Rural", "Public Urban", "Private Rural", "Private Urban"])
    .range(["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"]);

// Create an arc generator for the donut chart
var donutArc = d3.arc()
    .outerRadius(donutRadius - 10)
    .innerRadius(donutRadius - 70);

// Create a pie generator for the donut chart
var donutPie = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

// Append an SVG element to the donut chart container
var donutSvg = d3.select("#schoolTypeAreaDistribution")
    .append("svg")
    .attr("width", donutContainerWidth)
    .attr("height", donutContainerHeight)
    .append("g")
    .attr("transform", "translate(" + donutContainerWidth / 2 + "," + donutContainerHeight / 2 + ")");

// Create a tooltip div element for the donut chart
var donutTooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load data from CSV for the age distribution chart
d3.csv("../App/data/data.csv").then(function(data) {
    // Parse the data and calculate age
    data.forEach(function(d) {
        d.Age = new Date(d.Age);
        d.Age = calculateAge(d.Age);
    });

    // Separate data by gender
    var maleData = data.filter(function(d) { return d.Sexe === "M"; });
    var femaleData = data.filter(function(d) { return d.Sexe === "F"; });
    var myGroups = d3.map(data, function(d){return d.Age;}).keys()
    // X axis: scale and draw
    var x = d3.scaleLinear()
        // .domain([d3.min(data, function(d) { return +(d.Age-0.5) }), d3.max(data, function(d) { return +d.Age })])
        .domain(myGroups)
        .range([0, width]);

        
    // Y axis: scale and draw
    var y = d3.scaleLinear()
        .range([height, 0]);

    
    // Define histogram function for male students
    var maleHistogram = d3.histogram()
        .value(function(d) { return d.Age; })
        .domain(x.domain())
        .thresholds(x.ticks(7));

    // Calculate bins for male students
    var maleBins = maleHistogram(maleData);

    // Define histogram function for female students
    var femaleHistogram = d3.histogram()
        .value(function(d) { return d.Age; })
        .domain(x.domain())
        .thresholds(x.ticks(7));

    // Calculate bins for female students
    var femaleBins = femaleHistogram(femaleData);

    // Determine the maximum frequency for setting the y domain
    var maxFrequency = Math.max(
        d3.max(maleBins, function(d) { return d.length; }),
        d3.max(femaleBins, function(d) { return d.length; })
    );
    y.domain([0, maxFrequency]);

    // Draw X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Draw Y axis
    svg.append("g")
        .call(d3.axisLeft(y));


    // Draw bars for male students
    var maleBars = svg.selectAll("rect.male")
        .data(maleBins)
        .enter().append("rect")
        .attr("class", "male")
        .attr("x", 1)
        .attr("transform", function(d) {
            var barWidth = x(d.x1) - x(d.x0) - 1;
            return "translate(" + (x(d.x0) + barWidth >= 0 ? x(d.x0) : x(d.x0) + 1) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
            var barWidth = x(d.x1) - x(d.x0) - 1;
            return barWidth >= 0 ? barWidth : 1;
        })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "blue")
        .on("mouseover", function(d) {
            // Show tooltip on mouseover
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html("Male: " + d.length) // Customize the tooltip content as needed
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            // Hide tooltip on mouseout
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
         });

    // Draw bars for female students
    var femaleBars = svg.selectAll("rect.female")
        .data(femaleBins)
        .enter().append("rect")
        .attr("class", "female")
        .attr("x", 1)
        .attr("transform", function(d) {
            var barWidth = x(d.x1) - x(d.x0) - 1;
            return "translate(" + (x(d.x0) + barWidth >= 0 ? x(d.x0) : x(d.x0) + 1) + "," + y(d.length) + ")";
        })
        .attr("width", function(d) {
            var barWidth = x(d.x1) - x(d.x0) - 1;
            return barWidth >= 0 ? barWidth : 1;
        })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "pink")
        .on("mouseover", function(d) {
            // Show tooltip on mouseover
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html("Female: " + d.length) // Customize the tooltip content as needed
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            // Hide tooltip on mouseout
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
        // Legend Data
        var legendData = [
            { label: "Male", color: "blue" }, // Blue color for Male
            { label: "Female", color: "pink" } // Orange color for Female
        ];

        // Create a tooltip div element
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        

        // Create Legend
        var legend = svg.selectAll(".legend")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("circle")
            .attr("cx", width - 10)
            .attr("cy", 9)
            .attr("r", 8)
            .style("fill", function(d) { return d.color; });

        legend.append("text")
            .attr("x", width - 25)
            .attr("y", 7)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d.label; });
        // Add click event to legend items for toggling visibility
        legend.on("click", function(d) {
            var selectedClass = d.label.toLowerCase();
            if (selectedClass === "male") {
                toggleVisibility(maleBars);
            } else if (selectedClass === "female") {
                toggleVisibility(femaleBars);
            }
    

});
    // Function to toggle visibility of bars
    function toggleVisibility(bars) {
        var isVisible = bars.style("opacity") === "1";
        bars.transition().duration(500)
            .style("opacity", isVisible ? 0 : 1);
    }

    // Function to calculate age in years
    function calculateAge(dob) {
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Rest of your code for the donut chart
    // ...
});
