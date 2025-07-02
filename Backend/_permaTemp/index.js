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

if(startup = false) {
var sSearch = "select reference, refchapter, refverse, verse from nkjv where refbook = 'Jas' and refchapter = 1 and refverse < 9"
} else {
var sSearch = "select reference, refchapter, refverse, verse from nkjv where refbook = '2Ti' and refchapter = 3 and refverse > 15 and refverse < 18";
};

// db.query(sSearch, (err, res) => {
//   if (err) {
//     console.error("Error executing query", err.stack);
//   } else {
//     passage = res.rows;
//     // console.log(passage);    
//   }
//   db.end();
// })

app.get("/", async (req, res) => {
  thumperSearch();
  console.log(res.verse);
    res.render("index.ejs", { myPassage: passage });
});

function thumperSearch() { 
  db.connect();
  db.query(sSearch, (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    passage = res.rows;
    // console.log(passage);    
  }
  db.end();
  })
}


app.post("/submit", async (req, res) => {
    console.log(req.body.answer);
    //Store the left 3
    //Trim the left 4
    //Split the remainder into chapter and verse on the ":"
    //Concat that into sSearch
    // Call the query
    res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});