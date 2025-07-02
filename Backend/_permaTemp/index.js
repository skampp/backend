import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "thumper",
  password: "Cardigan.reboot7",
  port: 5432,
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let passage = [];
db.connect();

db.query("select reference, refchapter, refverse, verse from nkjv where refbook = 'Jas' and refchapter = 1 and refverse < 11", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    passage = res.rows;
    console.log(passage);    
  }
  db.end();
})

app.get("/", async (req, res) => {
    res.render("index.ejs", { myPassage: passage });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});