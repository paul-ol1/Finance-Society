let body = document.querySelector("body");
let startscreen = document.getElementById("start-screen");
let allcompanies;
let choicepage=document.getElementById("choice");
let companies = document.getElementById("Companies");
let leftsidehome = document.getElementById("leftside");
let rightsidehome = document.getElementById("rightside");


// animation for the homepage 
body.onclick=(()=>{
    console.log('click');
    body.style.opacity="0";
    body.style.transition = "all 2s linear";
    body.style.backgroundPosition = "right";
    body.onclick = null; // remove animation after click

    setTimeout(()=>{
        body.style.opacity = "1";
        startscreen.style.display="none";
    }, "3000")
    
    leftside();
    rightside();
    
})

function leftside(){
  /*
  takes from the json (could potentially change it to the database) of company list the names of companies then creates a choice system for the users the select one
  */
  return new Promise((resolve, reject) => { // using promise because of the time lag between execution and retrieval from databse
    fetch("/companylist")
      .then((response) => response.json()) // we are expecting a text response

      .then((data) => {
        resolve(data);
        allcompanies = data;
        companies.addEventListener("mouseenter", () => {
          document.body.style.cursor = "pointer"; // set cursor to pointer 
        });

        companies.addEventListener("mouseleave", () => {
          document.body.style.cursor = "auto"; // Reset cursor to default
        });
        for (let i in allcompanies) {
          let newoption = document.createElement("option");
          newoption.value = "" + allcompanies[i].Symbol;
          newoption.textContent = "" + allcompanies[i].Name;
          companies.appendChild(newoption);
          newoption.addEventListener("mouseenter", () => {
            document.body.style.cursor = "pointer";
          });

          newoption.addEventListener("mouseleave", () => {
            document.body.style.cursor = "auto"; // Reset cursor to default
          });
        }
        choicepage.style.display = "flex";
        choicepage.style.flexDirection = "row";
        choicepage.style.width = "100%";
        choicepage.style.height = "100%";
        choicepage.style.color = "white";
        leftsidehome.style.width = "50%";

        leftsidehome.style.display = "flex";
        leftsidehome.style.justifyContent = "center";
        leftsidehome.style.alignItems = "center";
      });
  });
};
// allows user to have the option to value using their own data
    function rightside(){
        rightsidehome.style.width = "50%";
        rightsidehome.style.display = "flex";
        //rightsidehome.style.backgroundColor = "#4470a4";
        rightsidehome.style.flexDirection = "column";
        rightsidehome.style.justifyContent = "center";
        rightsidehome.style.alignContent = "center";
        //rightsidehome.style.transition= "all 2s linear";
        let owndata = document.createElement('p');
        owndata.textContent="Use your own data";
        owndata.style.textAlign="center";
        rightsidehome.appendChild(owndata);
        owndata.addEventListener("mouseenter", () => {
          document.body.style.cursor = "pointer";
        });

        owndata.addEventListener("mouseleave", () => {
          document.body.style.cursor = "auto"; // Reset cursor to default
        });
        
    }
function createnewpage(){
    
}