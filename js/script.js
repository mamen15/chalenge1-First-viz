d3.csv("../App/data/data.csv").get(function(error,data){
    // console.log(data);
    // document.write(data);

    // Ages= data.map(item=> item.Age);
      // Convert 'Age' values to JavaScript Date objects and calculate age in years
    data.forEach(item => {
        item.Age = calculateAge(item.Age);
        item.code = "Student " + item.code; // Calculate age in years
    });
    // ages_years = Ages.map(item=> calculateAge(item));
    // studentId = data.map(item => "Student " + item.code );

    console.log(data); // Output: 'Age' values are now in years
    return true;

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

// // const fs = require('fs');
// // const XLSX = require('xlsx');
// // const moment = require('moment');
// Read the XLSX file
// const workbook = XLSX.readFile("../App/data/data.xlsx");

// // Get the first sheet
// const sheetName = workbook.SheetNames[0];
// const sheet = workbook.Sheets[sheetName];

// // Parse sheet data
// const data = XLSX.utils.sheet_to_json(sheet);

  
// const currentYear = new Date().getFullYear(); // Get current year

// // Function to calculate age in years from the given birthdate using moment.js
// function calculateAge(birthdate) {
//     const excelEpoch = new Date(1900, 0, 1);
//     const birthDate = new Date(excelEpoch.setDate(excelEpoch.getDate() + birthdate)); // Parse date using moment.js
//     const years = currentYear - birthDate.getFullYear();
//     return years;
//   }
  
//   // Convert 'Age' values to JavaScript Date objects and calculate age in years
// data.forEach(item => {
//     item.Age = calculateAge(item.Age); // Calculate age in years
// });
  
// console.log(data); // Output: 'Age' values are now in years
// // Ages = data.map(item => item.Age)
// // console.log(Ages)
// document.write(data);

// var ageData = data.map(function(student) {
//     return student.Age;
// });

// // var margin = {top: 30, right: 30, bottom: 30, left: 40};
// var width = 400 - margin.left - margin.right;
// var height = 300 - margin.top - margin.bottom;

// var svg1 = d3.select("#ageDistribution")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var x = d3.scaleLinear()
//     .domain([0, d3.max(ageData)])
//     .range([0, width]);

// var histogram = d3.histogram()
//     .domain(x.domain())
//     .thresholds(x.ticks(10))
//     (ageData);

// var y = d3.scaleLinear()
//     .domain([0, d3.max(histogram, function(d) { return d.length; })])
//     .range([height, 0]);

// svg1.selectAll("rect")
//     .data(histogram)
//     .enter().append("rect")
//     .attr("x", function(d) { return x(d.x0); })
//     .attr("y", function(d) { return y(d.length); })
//     .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
//     .attr("height", function(d) { return height - y(d.length); });

// // Add X Axis
// svg1.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));

// // Add Y Axis
// svg1.append("g")
//     .call(d3.axisLeft(y));

// // Add X Axis Label
// svg1.append("text")
//     .attr("transform", "translate(" + (width / 2) + "," + (height + margin.top + 10) + ")")
//     .style("text-anchor", "middle")
//     .text("Age");

// // Add Y Axis Label
// svg1.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .style("text-anchor", "middle")
//     .text("Number of Students");


// const input = document.getElementById('file-input');
// const outputDiv = document.getElementById('output');

// input.addEventListener('change', (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = function (e) {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet);
//         displayData(jsonData);
//     };

//     reader.readAsArrayBuffer(file);
// });

// function displayData(data) {
//     outputDiv.innerHTML = '<h2>File Contents:</h2>';
//     if (data.length === 0) {
//         outputDiv.innerHTML += '<p>No data found in the file.</p>';
//     } else {
//         outputDiv.innerHTML += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
//     }
// }

// var request = new XMLHttpRequest();
// // may be necessary to escape path string?
// request.open("GET", "../App/data/data.xlsx");
// request.responseType = "arraybuffer";
// request.onload = function () {
//    // this.response should be `ArrayBuffer` of `.xlsx` file
//    var file = new File(this.response, "data.xlsx");
//    // do stuff with `file`
// };
// request.send();
