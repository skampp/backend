import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Cardigan.reboot7",
  port: 5432,
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  // Other Method:
  // var sSearch = "insert into users (email, password) values ('" + email + "', '" + password + "')";
  // const addUser = await doSearch(sSearch);

  try {
  const checkResult = await db.query(
    "SELECT * from users WHERE email = $1", [
      email
    ]
  );

  if(checkResult.rowCount > 0) {
    res.send("Email already exists.  Try <a href='http://localhost:3000'>logging in</a>.");
  } else {
      const addUser = await db.query(
        "insert into users (email, password) values ($1, $2)",
        [email, password]
      );
      res.render("secrets.ejs");
  };
} catch (err) {
  console.log (err) ;
}
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function doSearch(sSearch) {
  try {
    const result = await db.query(sSearch);
    return result.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
    return [];
  }
}

