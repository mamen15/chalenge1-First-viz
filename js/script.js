const fs = require('fs');
const XLSX = require('xlsx');
const moment = require('moment');
// Read the XLSX file
const workbook = XLSX.readFile('./base de données.xlsx');

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Parse sheet data
const data = XLSX.utils.sheet_to_json(sheet);
document.write("data");
// console.log(data);
// Log the parsed data
// console.log(data);
// current = new Date();
// Age = data.map(item => item.Age);
// console.log(Age);
  
// Function to calculate age in years from the given birthdate using moment.js
function calculateAge(birthdate) {
    const today = moment();
    const birthDate = moment(birthdate, 'DD/MM/YYYY'); // Parse date using moment.js
    const age = today.diff(birthDate, 'years');
    return age;
  }
  
  // Convert 'Age' values to JavaScript Date objects and calculate age in years
data.forEach(item => {
    item.Age = calculateAge(item.Age); // Calculate age in years
  });
  console.log(data);
  
// document.write(data); // Output: 'Age' values are now in years
// const nbr = 40197;
// today = new Date() - nbr.getFullYear();
// console.log(today);