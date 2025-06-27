import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
let data;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//When the user loads the page for the first time, a random activity is called and returned,
//then displayed on index.ejs.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

//When the user makes any selections in the form on index.ejs, they are POSTed to here.  A random entry
//that matches their criteria is then send back to index.ejs with those results, where they are populated
//in the card under the form.
app.post("/", async (req, res) => {
  try {
    const userResponse = await axios.get("https://bored-api.appbrewery.com/filter?type=" + req.body.type + "&participants=" + req.body.participants);
    const userResult = userResponse.data; //Why can't I just use userResponse.data.activity?  Would that work, but this is cleaner?  This is just the pattern I learned.
    let rndActivity = Math.floor(Math.random()*userResult.length); //the LET statement scopes rndActivity to this block I think.
    res.render("index.ejs", { bActivity: userResult[rndActivity].activity, bType: userResult[rndActivity].type, bParticipants: userResult[rndActivity].participants });
    //In the statement above, should I have done a 'let newVar = userResult[rndActivity]' and then used newVar in the result parameters?
    } catch(error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
