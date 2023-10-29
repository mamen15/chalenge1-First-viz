
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
    // console.log(data);
    // document.write(data);

    // Ages= data.map(item=> item.Age);
      // Convert 'Age' values to JavaScript Date objects and calculate age in years
    // data.forEach(item => {
    //     item.Age = calculateAge(item.Age);
    //     item.code = "Student " + item.code; // Calculate age in years
    // });
    data.forEach(function(d) {
        d.Age = new Date(d.Age);
        d.Age = calculateAge(d.Age);
    });
    // ages_years = Ages.map(item=> calculateAge(item));
    // studentId = data.map(item => "Student " + item.code );

    console.log(data); // Output: 'Age' values are now in years

    // 1. Age Distribution: Histogram
    // X axis: scale and draw:
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Age })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.Age; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(5)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    // svg.selectAll("rect")
    //     .data(bins)
    //     .enter()
    //     .append("rect")
    //       .attr("x", 1)
    //       .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    //       .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    //       .attr("height", function(d) { return height - y(d.length); })
    //       .style("fill", "#69b3a2")
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { 
                var barWidth = x(d.x1) - x(d.x0) - 1;
                return "translate(" + (x(d.x0) + barWidth >= 0 ? x(d.x0) : x(d.x0) + 1) + "," + y(d.length) + ")"; 
            })
            .attr("width", function(d) { 
                var barWidth = x(d.x1) - x(d.x0) - 1;
                return barWidth >= 0 ? barWidth : 1; // Ensure the width is not negative
            })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#69b3a2");
        
});     

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