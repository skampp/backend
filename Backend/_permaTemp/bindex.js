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
var startup = true;

app.get("/", async (req, res) => {
    doSearch();

  res.render("index.ejs", { myPassage: passage });
});

function doSearch() {
  db.connect();
  if (startup) {
    var sSearch =
      "select reference, refchapter, refverse, verse from nkjv where refbook = 'Jas' and refchapter = 1 and refverse < 9";
  } else {
    var sSearch = "select reference, refchapter, refverse, verse from nkjv where refbook = '1Ti' and refchapter = 2 and refverse > 15 < 18";
  }

  db.query(sSearch, (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      passage = res.rows;
      console.log(passage);
    }
    db.end();
  });
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
