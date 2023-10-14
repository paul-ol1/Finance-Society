const express = require("express"); //Set up the express module
const app = express();
const port = 8080;
let SandP500Json;
const fs = require("fs");
const path = require("path"); // bring in the path module to help locate files
const sqlite3 = require("sqlite3").verbose(); // pulls the sql module
const bodyParser = require("body-parser"); // this pulls in body-parser
const { all } = require("proxy-addr");
const regex = /^[Aa]\d+@aup\.edu/;
app.use(bodyParser.json()); // this tells the server to look for JSON requests

// Calls the existing database
let database = new sqlite3.Database("users.db", function (error) {
  if (error) {
    console.error(err.message);
    return {};
  }
});
const cookieParser = require("cookie-parser");
app.use(cookieParser());

fs.readFile("S&P500.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  SandP500Json = JSON.parse(data);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "homepage.html"));
});
app.get("/dashboard", function (req, res) {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/companylist", function (req, res) {
  res.send(SandP500Json);
});

app.post("/log-in", async function (req, res) {
  let password = req.body.ps;
  let email = req.body.em;

  const sql = "SELECT * FROM users WHERE Email = ? AND Password = ?";

  if (regex.test(email)) {
    try {
      const user = await confirmaccount(sql, [email, password]);
      if (user) {
        // User found, send a success response and set the cookie
        createcookie(email, res); // Set the cookie first
        res.status(200).json({ message: "Logged in successfully" });
      } else {
        // User not found, send an error response
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (err) {
      console.log(err);
      // Handle database errors
      res.status(500).json({ error: "Server error" });
    }
  } else {
    // Invalid email format, send a response
    res.status(406).json({ error: "Invalid Email Format!" });
  }
});

app.post("/newaccount", async function (req, res) {
  let firstname = req.body.fn;
  let lastname = req.body.ln;
  let password = req.body.ps;
  let email = req.body.em;

  if (regex.test(email)) {
    try {
      await createacctAsyncfunc(
        "INSERT INTO Users (Email,Fname,Lname,Password) VALUES (?,?,?,?)",
        [email, firstname, lastname, password]
      );
      // Set the cookie first and then send the response
      createcookie(email, res);
      res.status(201).json({ message: "Data inserted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Account already exists" });
    }
  } else {
    res.status(406).json({ error: "Wrong Email format" });
  }
});


// This code return jpg images, html, css, and js files
// The first parameter is an array of file extensions to match
app.get(
  ["/*.jpg", "/*.css", "/*.html", "/*.js", "/*.png"],
  function (req, res) {
    res.sendFile(path.join(__dirname, req.path)); // req.path is the path of the requested file
  }
);

// Start listening for requests on the designated port
// This can be at the beginning, or the end, or in-between.
// Conventionally it is put at the end
let server = app.listen(port, function () {
  console.log("App server is running on port", port);
  console.log("to end press Ctrl + C");
});

function createacctAsyncfunc(sql, params) {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function confirmaccount(sql, params) {
  return new Promise((resolve, reject) => {
    database.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getuserdata(email){
  const sql = "SELECT * FROM users WHERE Email = ?";
    return new Promise((resolve, reject) => {
    database.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function createcookie(email, res) {
  try {
    const user = await getuserdata(email);
    if (user) {
      const userCookie = {
        firstname: user.Fname,
        lastname: user.Lname,
        ID: user.UserID,
      };

      res.cookie("Userdetails", userCookie, {
        expires: new Date(Date.now() + 7200000),
      });
    }
  } catch (err) {
    console.error(err);
    // Handle any error that occurs when retrieving user data
  }
}
