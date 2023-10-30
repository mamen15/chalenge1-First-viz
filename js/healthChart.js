// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#ageDistribution")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../App/data/data.csv").get(function(data){
    // Count the number of students for each health issue
    var healthCounts = {};
    data.forEach(function(d) {
        if (d["problèmes de santé"] in healthCounts) {
            healthCounts[d["problèmes de santé"]] += 1;
        } else {
            healthCounts[d["problèmes de santé"]] = 1;
        }
    });

    // Convert healthCounts object to an array of objects for easier data binding
    var healthData = Object.keys(healthCounts).map(function(key) {
        return { issue: key, count: healthCounts[key] };
    });

    // X axis: scale and draw
    var healthX = d3.scaleBand()
        .domain(healthData.map(function(d) { return d.issue; }))
        .range([0, healthWidth])
        .padding(0.1);

    // Y axis: scale and draw
    var healthY = d3.scaleLinear()
        .domain([0, d3.max(healthData, function(d) { return d.count; })])
        .nice()
        .range([healthHeight, 0]);

    // Draw X axis
    healthSvg.append("g")
        .attr("transform", "translate(0," + healthHeight + ")")
        .call(d3.axisBottom(healthX));

    // Draw Y axis
    healthSvg.append("g")
        .call(d3.axisLeft(healthY));

    // Draw bars
    healthSvg.selectAll(".bar")
        .data(healthData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return healthX(d.issue); })
        .attr("y", function(d) { return healthY(d.count); })
        .attr("width", healthX.bandwidth())
        .attr("height", function(d) { return healthHeight - healthY(d.count); })
        .style("fill", "#69b3a2");

    // X-axis label
    healthSvg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (healthWidth / 2) + "," + (healthHeight + healthMargin.top + 20) + ")")
        .text("Health Issues");

    // Y-axis label
    healthSvg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - healthMargin.left)
        .attr("x", 0 - (healthHeight / 2))
        .attr("dy", "1em")
        .text("Number of Students");

});