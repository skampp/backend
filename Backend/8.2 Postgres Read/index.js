import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Cardigan.reboot7",
  port: 5432,
});

const app = express();
const port = 3000;

db.connect();
let quiz = [];

// In a db.query(), the RESponse is the response of the query back to the function.
// Let's see what the whole response is if we can.
// quiz = res.fields.length; // number of fields
// quiz = res.fields[0];
// quiz = res.fields[0].name; .tableID; .columnID; .format; others less useful maybe?
// quiz = res.rows; // gives the actual rows of data
// quiz = res.rowCount; // gives the number of rows returned
db.query("SELECT * FROM flags", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
    console.log(quiz);
  }
  db.end();
})

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  // console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
  console.log(currentQuestion);
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
