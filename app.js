const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");


const app = express();

/* In order to allow server to use static files, need to declare a public location
for all the static file, in this case, moving images/ and css/ into newly created 
public/ directory */

app.use(express.static("public"))


/* user bodyParser module to read HTML form and decode the user input from the form */
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  
  /* Send the html file to user side. */
  res.sendFile(__dirname + "/html/signup.html")

  // res.set({"Accept":  "text/html; charset=utf-8" });
  // res.write("Server is running~!");
  // res.send();
})

app.post("/", (req, res) => {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAddress = req.body.email;


  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };
  

  /* This "stringify method will transform json file into flatline data" */
  const jsonData = JSON.stringify(data);

  const listId = "7c45b927b9";
  const dc = "us19";
  const apiKey = "121d6ea02af3d2b734847c8060453614-"+dc;

  const url = "https://" + dc + ".api.mailchimp.com/3.0/lists/" + listId;
  
  /* provide apiKey to APP so "POST" action is authenticated using basic HTTPS 
  authentication */
  const options = {
    method: "POST",
    auth: "screwyterror83:" + apiKey,
  };
  

  /* making a "request" constant to include request options and url to make the "POST"
  action happen, the purpose of the new declaration is to make further function call 
  much easier, and the callback function spit out the request result from the target as output.*/
  const request = https.request(url, options, (response) => {
    
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/html/success.html");
    } else {
      res.sendFile(__dirname + "/html/failure.html");
    }
    
    response.on("data", (data) => {
      console.log(JSON.parse(data));


    });
  });

/* The actual method to send the data over to the service. */
  request.write(jsonData);
  request.end();

  })

app.post("/failure", (req,res) => {
  res.redirect("/");
})



app.listen(process.env.PORT || 3000, () => {
  console.log("Newsletter Signup Server is running.");

})



// API Key  
// 121d6ea02af3d2b734847c8060453614-us19

// list ID
// 7c45b927b9
