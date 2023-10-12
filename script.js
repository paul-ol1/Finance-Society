let body = document.querySelector("body");
let startscreen = document.getElementById("start-screen");
let dashboard = document.getElementById("dashboard");
let login = document.getElementById("container");
let boxes = document.getElementsByClassName("box");
let boxinfo = document.getElementsByClassName("fa-sharp");
let email, firstname, lastname, password;
let definitions = [
  "CAPM is the formula used to calculate the cost of equity; the rate of return a company pays to equity investors. ",
  "The cost of capital is the expected return to equity owners and to debtholders. The WACC solves for the investor's opportunity cost of taking on the risk of putting money into a company.",
  "The Gordon growth model is a financial valuation technique for computing a stock's intrinsic value.",
  "Discounted cash flow is a valuation method that estimates the value of an investment using its expected future cash flows.",
];



// type writer animation recursively

function boxdivs(index) {
  let newP = document.createElement("p");
  let currentDef = definitions[index]; // Get the current definition
  let currentIndex = 0; // Initialize an index variable
  newP.style.display = "block";
  boxes[index].querySelector(".inner-box-lower").prepend(newP); // Append the <p> element at the start
  function addLetter() {
    if (currentIndex < currentDef.length) {
      // Add the current letter to the paragraph
      newP.textContent += currentDef[currentIndex];
      // Increment the index
      currentIndex++;
      // use timeout to create recursion
      setTimeout(addLetter, 50);
    }
  }

  addLetter();
  boxinfo[index].onclick = "";
}

function signup() {
  email = document.getElementById("email-input").value;
  firstname = document.getElementById("fname-input").value;
  lastname = document.getElementById("lname-input").value;
  password = document.getElementById("password-input").value;

  if (email == "" || firstname == "" || lastname == "" || password == "") {
    alert("Please fill all fields");
  } else {
    let mybody = {
      em: email,
      fn: firstname,
      ln: lastname,
      ps: password,
    };
    fetch("/newaccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, // says that arguments are JSON formatted
      body: JSON.stringify(mybody), // POST puts arguments in the message body
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.error);
          });
        }
      })
      .then((data) => {
        // Handle the successful response here
        console.log(data.message);
        // You can also redirect the user or update the UI here
      })
      .catch((error) => {
        alert("Account already exist"); // Display an alert with the error message
      });
  }}


function loginfunc() {
  email = document.getElementById("email-input").value;
  password = document.getElementById("password-input").value;

  let mybody = {
    em: email,
    ps: password,
  };
  if (email == "" || password == "") {
    alert("Please fill all fields");
  }
  else{
  fetch("/log-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mybody),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((data) => {
          throw new Error(data.error);
        });
      }
    })
    .then((data) => {
      // Handle the successful response here
      console.log(data.message);
      // You can also redirect the user or update the UI here
    })
    .catch((error) => {
      alert("Error: " + error.message); // Display an alert with the error message
    });

}}
