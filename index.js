const express = require("express"); //Set up the express module
const app = express();
const port = 8080;
let SandP500Json;
const fs = require("fs");
const path = require("path"); // bring in the path module to help locate files


fs.readFile("S&P500.json","utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
      
    }
    SandP500Json= JSON.parse(data);
}
);

// Start listening for requests on the designated port
// This can be at the beginning, or the end, or in-between.
// Conventionally it is put at the end
let server = app.listen(port, function () {
    console.log("App server is running on port", port);
    console.log("to end press Ctrl + C");
});



/* This code sends a file (containing the HTML for a web page) */
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "homepage.html"));
});

app.get("/companylist", function (req, res) {

    res.send(SandP500Json);
  
});
// This code return jpg images, html, css, and js files
// The first parameter is an array of file extensions to match
app.get(["/*.jpg", "/*.css", "/*.html", "/*.js", "/*.png"], function (req, res) {
  res.sendFile(path.join(__dirname, req.path)); // req.path is the path of the requested file
});
