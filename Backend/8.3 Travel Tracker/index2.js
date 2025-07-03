import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Cardigan.reboot7",
  port: 5432,
});

var error = {
  status: false,
  message: "",
};

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

// GET home page
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    error: error,
  });
  error.status = false;
  error.message = "";
});

//INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  // console.log("Input: "+input);

  const result = await db.query("SELECT country_code FROM countries WHERE country_name = $1", [input] );
// const result = await db.query("SELECT country_code FROM countries WHERE lower(country_name) LIKE $1 || '%';", [input] );

  if (result.rows.length !== 0) { // Country name was found, proceeding
    const data = result.rows[0];
    const countryCode = data.country_code;
    const countryExists = await db.query(
      "SELECT  country_code FROM visited_countries WHERE country_code = $1",
      [countryCode]
    );
    if (countryExists.rows.length == 0) { // Country has not been listed as visited
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode] );
    } else {  // Country has already been listed as visited
      error.status = true;
      error.message = "Visited Country exists - nothing added.";
    }
    res.redirect("/");
  } else {  // Country name was not found
    error.status = true;
    error.message = "No country by that name exists.";
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
