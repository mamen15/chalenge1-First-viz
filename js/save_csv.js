function downloadCSV(data, filename) {
    var csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(rowArray) {
        var row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename + ".csv");
    document.body.appendChild(link); 

    link.click(); // This will download the CSV file
}