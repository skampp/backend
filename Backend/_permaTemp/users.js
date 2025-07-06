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

await db.connect();

var uSearch = "SELECT * FROM thuser";

// Startup - User logged out
app.get("/", async (req, res) => {
  const resultUsers = await thumperSearch(uSearch);
  res.render("users.ejs", { userLogged: userLogged, myUsers: resultUsers });
});

// User logs in (or changes the active list)
app.post("/usersubmit", async (req, res) => {
  if (req.body.listChanged) {   // Are we changing the current list?
    var cSearch =
      "UPDATE thuser SET defaultlist = '" +
      req.body.listChoice +
      "' WHERE userid = " +
      req.body.userID;
    await thumperSearch(cSearch);
  }
  if (req.body.verses) {    // Are we deleting verses to delete?
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
  if (req.body.addverse) {      // Are we adding a verse to the current list?
    var aSearch = "INSERT INTO thlistpopulation (verselistid, listreference) VALUES ('" + req.body.defaultlist + "', '" + req.body.addverse + "')"; //thlistpopulation.verselistid
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
  res.render("users.ejs", {
    userLogged: userLogged,
    myUsers: resultUsers,
    myVerses: resultVerses,
  });
});

// User logs out
app.post("/logout", async (req, res) => {
  userLogged = false;
  res.render("users.ejs", { userLogged: userLogged });
});

// Perform any search, and return the results
// Adding myField, myID for future use
async function thumperSearch(sSearch, myField, myID) {
  try {
    const result = await db.query(sSearch);
    return result.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return [];
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
