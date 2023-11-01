var margin = {
    top: 30,
    right: 30,
    bottom: 50,
    left: 50
};

var width = 460 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#ageDistribution").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../App/data/data.csv").then(function (data) {
    try { // Parse the data and calculate age
        data.forEach(function (d) {
            d.Age = new Date(d.Age);
            d.Age = calculateAge(d.Age);
        });

        // Filter data for males and females
        var males = data.filter(function (d) {
            return d.Sexe === "M";
        });
        var females = data.filter(function (d) {
            return d.Sexe === "F";
        });

        // Count the number of students for each age for males and females separately
        var maleAgeCounts = d3.group(males, d => d.Age);
        var femaleAgeCounts = d3.group(females, d => d.Age);

        // Merge male and female age counts into a single array
        var mergedData = [];
        maleAgeCounts.forEach(function (count, age) {
            mergedData.push({Age: age, Count: count.length, Gender: "Male"});
        });
        femaleAgeCounts.forEach(function (count, age) {
            mergedData.push({Age: age, Count: count.length, Gender: "Female"});
        });

        mergedData.sort(function (a, b) {
            return a.Age - b.Age;
        });
        // X axis: scale and draw
        var x = d3.scaleBand().domain(mergedData.map(function (d) {
            return d.Age;
        })).range([0, width]).padding(0.1);

        // Y axis: scale and draw
        var y = d3.scaleLinear().domain([
            0, d3.max(mergedData, function (d) {
                return d.Count;
            })
        ]).nice().range([height, 0]);

        var tooltipAgeHist = d3.select(".tooltipAgeHist");

        // console.log(mergedData)
        // Draw bars for males
        svg.selectAll(".bar").data(mergedData).enter().append("rect").attr("class", "bar").attr("x", function (d) {
            return x(d.Age);
        }).attr("y", function (d) {
            return y(d.Count);
        }).attr("width", x.bandwidth()).attr("height", function (d) {
            return height - y(d.Count);
        }).style("fill", function (d) {
            return d.Gender === "Male" ? "skyblue" : "pink";
        }).on("mouseover", function (event, d) {
            // Show tooltipAgeHist on mouseover
            tooltipAgeHist.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltipAgeHist.html("Students:" + (d.Count || 0) + "<br>Gender:" + d.Gender + "<br>Age:" + d.Age)  // Use logical OR to handle undefined case
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            // Hide tooltipAgeHist on mouseout
            tooltipAgeHist.transition()
                .duration(500)
                .style("opacity", 0);
        });

        // Create X axis
        svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

        // Create Y axis
        svg.append("g").call(d3.axisLeft(y));
        // Define legend data
        var legendData = ["Male", "Female"];

        // Create color scale for legend items
        var legendColor = d3.scaleOrdinal().domain(legendData).range(["skyblue", "pink"]);

        // Draw legend items
        var legend = svg.selectAll(".legend").data(legendData).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

        legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", function (d) {
            return legendColor(d);
        });

        legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
            return d;
        });
    } catch (error) {
        console.error("Error:", error);
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
}).catch(function (error) {
    console.error("Error loading data:", error);
});
