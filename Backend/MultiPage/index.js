import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.post("/search", (req, res) => {
  console.log("Searching...");
  const searchValue = req.body.searchValue;
  console.log(searchValue);
  res.render("index.ejs", { myVerse: searchValue })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});