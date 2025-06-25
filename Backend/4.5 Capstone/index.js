import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const ENTRIES_DIR = join(__dirname, "entries");
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir(ENTRIES_DIR, (err, files) => {
    if (err) return res.status(500).send("Could not read entries folder.");
    const txtFiles = files.filter((file) => file.endsWith(".txt"));
    res.render("index.ejs", { files: txtFiles });
  });
});

app.get("/view/:filename", (req, res) => {
  const filePath = path.join(ENTRIES_DIR, req.params.filename);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).send("File not found.");
    const lines = data.split("\n");
    const entryTitle = lines.shift().trim(); // first line
    const entryBody = lines.join("\n").trim(); // rest of the content
    res.render("view", {
      entryTitle,
      entryBody,
      filename: req.params.filename,
      editMode: req.query.edit === "true",
    });
  });
});

app.post("/delete/:filename", (req, res) => {
  const filePath = path.join(ENTRIES_DIR, path.basename(req.params.filename)); // sanitize input
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send("Failed to delete the file.");
    res.redirect("/");
  });
});

app.post("/edit", (req, res) => {
  const { filename, entryTitle, entryBody } = req.body;
  if (!filename || !entryTitle || !entryBody) {
    return res.status(400).send("Missing required fields.");
  }
  const filePath = path.join(ENTRIES_DIR, filename);
  const content = `${entryTitle.trim()}\n${entryBody.trim()}`;
  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) return res.status(500).send("Failed to save file.");
    res.redirect(`/view/${filename}`);
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
