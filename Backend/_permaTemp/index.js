import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session"
import passport from "passport";
import { Strategy} from "passport-local";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 100*60*60*24,
    }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

var userLogged = false;
var badUser = false;
var paragraphMode = true;

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
    res.render("index.ejs", {
      myPassage: resultVerses,
      userLogged: userLogged,
      myUsers: resultUsers,
      badUser: badUser,
      paragraphMode: paragraphMode,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure"
  })
  // console.log("User hit the login endpoint at least.");
);

app.get("/failure", (req, res) => {
  res.render("failure.ejs");
});

app.get("/success", async (req, res) => {
  if(req.isAuthenticated()) {
    const resultVerses = await thumperSearch(sSearch);
    const resultUsers = await thumperSearch(uSearch);
    console.log("resultUsers:");
    console.log(resultUsers);
    userLogged = true;
      res.render("index.ejs", {
      myPassage: resultVerses,
      myVerses: resultVerses,
      userLogged: userLogged,
      myUsers: resultUsers,
      badUser: badUser,
      paragraphMode: paragraphMode,
    });
    
  } else {
    res.redirect("/failure");
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
  sSearch += " ORDER BY refverse"
  const result = await thumperSearch(sSearch);
  if (userLogged) {
    res.render("index.ejs", {
      userLogged: userLogged,
      myUsers: resultUsers,
      myVerses: resultVerses,
      myPassage: result,
      paragraphMode: paragraphMode,
    });
  } else {
    res.render("index.ejs", { myPassage: result, paragraphMode: paragraphMode });
  }
});

app.post("/versesubmit", async (req, res) => {

});


app.post("/usersubmit", async (req, res) => {
  // console.log("1: " + req.body.verseItems);
  // console.log("2: " + req.body.userID);
  // console.log("3: " + req.body.user);
  // console.log("4: " + req.body.userLogged);
  // console.log("5: " + req.body.listChanged);
  // console.log("6: " + req.body.resultPassage);
  var myResults = JSON.parse(req.body.resultPassage); // necessary when bringing arrays back thru html forms via hidden elements
  try {
    if (req.body.userID) {
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
      // console.log(aSearch);
      thumperSearch(aSearch);
    }

    // User stuff
  try {
    var uSearch =
      "SELECT * FROM thlistsubscription s JOIN thuser u ON s.popuserid = u.userid JOIN thlists l ON l.listid = s.poplistid WHERE lower(u.username) = '" +
      req.body.user.toLowerCase() + "'";
      const resultUsers = await thumperSearch(uSearch); // Actual user login
      // console.log("resultUsers: " + resultUsers); // this is the next stopsign.  resolves to nothing.
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
      paragraphMode: paragraphMode,
    });
  } catch (err) {
    console.log(err);
    badUser = true;
    userLogged = false;
    res.redirect("/");
  }


  } catch (err) {
    console.log("Somebody messed up.");
    console.log(err);
  }
});

// User logs out
app.post("/logout", async (req, res) => {
  try {
    paragraphMode = JSON.parse(req.body.paragraphMode);
    var myResults = JSON.parse(req.body.resultPassage); // necessary when bringing arrays back thru html forms via hidden elements
    userLogged = false;
    res.render("index.ejs", { myPassage: myResults, userLogged: userLogged, paragraphMode: paragraphMode });
  } catch (err) {
    console.log(err);
  }
});

// Future use
async function fullName(sBook) {
  const retValue = sBook;
  return retValue;
}

app.post("/register", async (req, res) => {
  const email = req.body.user;
  const password = req.body.password;
  console.log("Hit the register endpoint.  U: " + email + ", P: " + password);
  
  // Need to make a registration form to return the above items.
  // Manually call it for now.

  try {
    const checkResult = await db.query("SELECT * FROM thuser WHERE username = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      req.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO thuser (username, userprivacy, useremail, hashtag, defaultlist) VALUES ($1, false, $1, $2, 1) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          const addDefaultSub = await db.query(
            "INSERT INTO thlistsubscription (popuserid, poplistid) VALUES ($1, $2)", [user.userid, user.defaultlist]
          );
          req.login(user, (err) => {
            console.log("success");
            // Need a landing page, which woudld have been //usersubmit.  Figure out how to work this back into the normal-but-modified flow.
            res.redirect("/");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM thuser WHERE username = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];        
        const storedHashedPassword = user.hashtag;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

