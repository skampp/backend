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
await db.connect(); // optional if already connected

if ((startup = false)) {
  var sSearch =
    "select reference, refchapter, refbook, refverse, verse from nkjv where refbook = 'Jas' and refchapter = 1 and refverse < 9";
} else {
  var sSearch =
    "select reference, refchapter, refbook, refverse, verse from nkjv where refbook = '2Ti' and refchapter = 3 and refverse > 15 and refverse < 18";
}

async function thumperSearch(sSearch) {

  console.log("1. sSearch: " + sSearch);
  
  try {
    const result = await db.query(sSearch); // no callback here
    console.log(result.rows[0]); // you now have access to the rows
    return result.rows; // just return the data you want
  } catch (err) {
    console.error("Error executing query", err.stack);
    return []; // or handle error as appropriate
  }
}

app.get("/", async (req, res) => {
  const resultVerses = await thumperSearch(sSearch);
  console.log(resultVerses);
  res.render("index.ejs", { myPassage: resultVerses });
});

app.post("/submit", async (req, res) => {
  var fullString = req.body.answer;
  const sBook = fullString.substring(0, 3);
  fullString = fullString.slice(4);
  const [sChapter, sVerse] = fullString.split(":");
  const [sStartVerse, sEndVerse] = sVerse.split("-");
  
  var sSearch = "select reference, refbook, refchapter, refverse, verse from nkjv where lower(refbook) = '" + sBook.toLowerCase() + "' and refchapter = " + sChapter + " and refverse"
  
  if (sEndVerse) {
    sSearch = sSearch + " between " + sStartVerse + " and " + sEndVerse;
  } else {
    sSearch = sSearch + " = " + sStartVerse;
  }

  // console.log(sSearch);
  const result = await thumperSearch(sSearch);
  res.render("index.ejs", { myPassage: result });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
