import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
     res.render("index.ejs");
 });
app.post("/submit", (req, res) => {
  const numLetters = req.body["fName"].length + req.body["lName"].length; // This is how I get returned values from the ejs form (req is being sent from the ejs to the js)
  res.render("index.ejs", { numberOfLetters: numLetters }); // ** numberOfLetters is the variable being passed, with the value of numLetters!! ** (res is what's going out of the js to the ejs)
  // I still have no idea why the curly braces... but know that KV pairs are in curlies.
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Client Side is the EJS, Server Side is the JS
// This is a great lesson.  Simple enough but hard enough.
//req(est) is incoming, res(ponse) is outgoing.  ("This is what's being requested of me - incoming, this is my response - outgoing.")
