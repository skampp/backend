import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("flexbox.ejs");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("flexbox.ejs");
});

app.post("/search", (req, res) => {
  console.log("Searching...");
  const searchValue = req.body.searchValue;
  console.log(searchValue);
  // res.render("flexbox.ejs", { myVerse: searchValue })
  res.render("flexbox.ejs");
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});