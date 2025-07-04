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
var startup = false;
await db.connect(); // optional if already connected

if ((startup = true)) {
  var sSearch =
    "SELECT book_stats.book, * FROM nkjv JOIN book_stats on nkjv.refbook = book_stats.abbrev where refbook = 'Jas' and refchapter = 1 and refverse < 9";
} else {
  var sSearch =
    "SELECT book_stats.book, * FROM nkjv JOIN book_stats on nkjv.refbook = book_stats.abbrev where refbook = '2Ti' and refchapter = 3 and refverse > 15 and refverse < 18";
}

async function thumperSearch(sSearch) {
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
  // Fix the next line.  Need to split it on the space character?  In case it's Jas or James.
  const sBook = fullString.substring(0, 3);
  // This will not be valid, either - fix it next.
  fullString = fullString.slice(4);
  const [sChapter, sVerse] = fullString.split(":");
  const [sStartVerse, sEndVerse] = sVerse.split("-");

  var sSearch = "SELECT book_stats.book, " +
  "* FROM nkjv JOIN book_stats on nkjv.refbook = book_stats.abbrev "+
  "where lower(refbook) = '" + sBook.toLowerCase() + "'"+
  " and refchapter = " + sChapter + " and refverse"
  
  if (sEndVerse) {
    sSearch = sSearch + " between " + sStartVerse + " and " + sEndVerse;
  } else {
    sSearch = sSearch + " = " + sStartVerse;
  }

  const result = await thumperSearch(sSearch);
  res.render("index.ejs", { myPassage: result });
});

// Future use
async function fullName(sBook) {
  const retValue = sBook;
  return retValue;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Changelog:
// 2025.07.02 First real search available
// 2025.07.03 Added book_stats table and JOINed for lookup of Jas to James
//            Added title "From the book of..." header
//            Added copy button to the ejs page