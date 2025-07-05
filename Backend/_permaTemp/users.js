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

var uSearch = "SELECT * FROM thuser"

// Startup - User logged out
app.get("/", async (req, res) => {
    const resultUsers = await thumperSearch(uSearch);
    res.render("users.ejs", { myUsers: resultUsers, userLogged: userLogged });
});

// User logs in
app.post("/usersubmit", async (req, res) => {
    var uSearch = "SELECT * FROM thlistsubscription s JOIN thuser u ON s.popuserid = u.userid JOIN thlists l ON l.listid = s.poplistid WHERE u.username = '" + req.body.user + "'" ;
    const resultUsers = await thumperSearch(uSearch);
    userLogged = true;
    res.render("users.ejs", { myUsers: resultUsers, userLogged: userLogged });
});

// User activates a list
app.post("/pickList", async (req, res) => {
    // All variables are passing now.  What next?  Do something!
    console.log(req.body.listChoice);
    // const results = thumperSearch(req.body.listChoice);

});

// User logs out
app.post("/logout", async (req, res) => {
    userLogged = false;
    res.render("users.ejs", { userLogged: userLogged });
});

// Perform any search, and return the results
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