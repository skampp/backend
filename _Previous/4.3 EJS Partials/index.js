import express from "express";

const app = express();
const port = 3000;

/* Write your code here:
Step 1: Render the home page "/" index.ejs
Step 2: Make sure that static files are linked to and the CSS shows up.
Step 3: Add the routes to handle the render of the about and contact pages.
  Hint: Check the nav bar in the header.ejs to see the button hrefs
Step 4: Add the partials to the about and contact pages to show the header and footer on those pages. */

app.use(express.static("public")); //Content that changes is by default in the Views folder.  Static content's root must be defined as shown here.
//Interesting that headers and footers are not considered static, but dynamic.

app.get("/", (req, res) => {
     res.render("index.ejs");
 });

app.get("/about", (req, res) => {
     res.render("about.ejs");
 });

 app.get("/contact", (req, res) => {
  res.render("contact.ejs");
  // This is how I get returned values from the ejs form (req is being sent from the ejs to the js)
  // ** numberOfLetters is the variable being passed, with the value of numLetters!! ** (res is what's going out of the js to the ejs)
  // I still have no idea why the curly braces... but know that KV pairs are in curlies.
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

