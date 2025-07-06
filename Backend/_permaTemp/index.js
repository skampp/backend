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
var userLogged = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let passage = [];
var startup = false;
await db.connect(); // optional if already connected
var uSearch = "SELECT * FROM thuser";

if ((startup = true)) {
  var sSearch =
    "SELECT book_stats.book, * FROM nkjv JOIN book_stats on nkjv.refbook = book_stats.abbrev where refbook = 'Jas' and refchapter = 1 and refverse < 9";
} else {
  var sSearch =
    "SELECT book_stats.book, * FROM nkjv JOIN book_stats on nkjv.refbook = book_stats.abbrev where refbook = '2Ti' and refchapter = 3 and refverse > 15 and refverse < 18";
}

async function thumperSearch(sSearch, myField, myID) {
  try {
    const result = await db.query(sSearch);
    return result.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return [];
  }
}

app.get("/", async (req, res) => {
  // Combined from INDEX and USERS, so far so good
  try {
    const resultVerses = await thumperSearch(sSearch);
    const resultUsers = await thumperSearch(uSearch);
    // console.log(resultVerses);
    res.render("index.ejs", {
      myPassage: resultVerses,
      userLogged: userLogged,
      myUsers: resultUsers,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/submit", async (req, res) => {
  // From INDEX only, incorporate USERS variables
  var fullString = req.body.answer;
  if (userLogged) {
    var resultUsers = JSON.parse(req.body.resultUsers);
    var resultVerses = JSON.parse(req.body.resultVerses);
  }

  // var userLogged = JSON.parse(req.body.userLogged);
  // To handle something with both 1 and 2 spaces, such as 'Genesis 1:1' and '1 Corinthians 1:1'.
  // Future issue to handle: multiples such as '1 Corinthians 1:1-5, 7-10'
  const lastSpace = fullString.lastIndexOf(" ");
  var sBook = fullString.slice(0, lastSpace);
  var fullString = fullString.slice(lastSpace + 1);
  var [sChapter, sVerse] = fullString.split(":");
  var [sStartVerse, sEndVerse] = sVerse.split("-");

  var sSearch =
    "SELECT book_stats.book, * FROM nkjv JOIN book_stats on nkjv.refbook = book_stats.abbrev ";
  if (sBook.length == 3) {
    sSearch += "where lower(refbook) = '" + sBook.toLowerCase() + "'";
  } else {
    sSearch += "where lower(book) = '" + sBook.toLowerCase() + "'";
  }
  sSearch += " and refchapter = " + sChapter + " and refverse";

  if (sEndVerse) {
    sSearch += " between " + sStartVerse + " and " + sEndVerse;
  } else {
    sSearch += " = " + sStartVerse;
  }
  const result = await thumperSearch(sSearch);
  if (userLogged) {
    res.render("index.ejs", {
      userLogged: userLogged,
      myUsers: resultUsers,
      myVerses: resultVerses,
      myPassage: result,
    });
  } else {
    res.render("index.ejs", { myPassage: result });
  }
});

app.post("/usersubmit", async (req, res) => {
  // *** CRITICAL ***
  // What is being passed to index.ejs on any submit?  Those things need to be included here
  // in order for the verse text to be populated.

  var myResults = JSON.parse(req.body.resultPassage); // necessary when bringing arrays back thru html forms via hidden elements
  try {
    if (req.body.listChanged) {
      // Are we changing the current list?
      var cSearch =
        "UPDATE thuser SET defaultlist = '" +
        req.body.listChoice +
        "' WHERE userid = " +
        req.body.userID;
      await thumperSearch(cSearch);
    }
    if (req.body.verses) {
      // Are we deleting verses to delete?
      if (Array.isArray(req.body.verses)) {
        req.body.verses.forEach((verse, i) => {
          var dSearch = "DELETE FROM thlistpopulation p WHERE id = " + verse;
          thumperSearch(dSearch);
        });
      } else {
        var dSearch =
          "DELETE FROM thlistpopulation p WHERE id = " + req.body.verses;
        await thumperSearch(dSearch);
      }
    }
    if (req.body.addverse) {
      // Are we adding a verse to the current list?
      var aSearch =
        "INSERT INTO thlistpopulation (verselistid, listreference) VALUES ('" +
        req.body.defaultlist +
        "', '" +
        req.body.addverse +
        "')"; //thlistpopulation.verselistid
      console.log(aSearch);
      thumperSearch(aSearch);
    }

    // User stuff

    var uSearch =
      "SELECT * FROM thlistsubscription s JOIN thuser u ON s.popuserid = u.userid JOIN thlists l ON l.listid = s.poplistid WHERE u.username = '" +
      req.body.user +
      "'";
    const resultUsers = await thumperSearch(uSearch);
    userLogged = true;

    // Verse stuff
    var vSearch =
      "SELECT * from thlistsubscription s JOIN thlistpopulation p on s.poplistid = p.verselistid WHERE s.poplistid = " +
      resultUsers[0].defaultlist;
    const resultVerses = await thumperSearch(vSearch);
    res.render("index.ejs", {
      userLogged: userLogged,
      myUsers: resultUsers,
      myVerses: resultVerses,
      myPassage: myResults,
    });
  } catch (err) {
    console.log(err);
  }
});

// User logs out
app.post("/logout", async (req, res) => {
  try {
    var myResults = JSON.parse(req.body.resultPassage); // necessary when bringing arrays back thru html forms via hidden elements
    userLogged = false;
    res.render("index.ejs", { myPassage: myResults, userLogged: userLogged });
  } catch (err) {
    console.log(err);
  }
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
//            Added ability to enter Jas or James, handled two-space entries such as '2 Timothy 3:16'
