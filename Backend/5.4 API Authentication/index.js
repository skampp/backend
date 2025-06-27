import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

const yourUsername = "cmartin3webdev";
const yourPassword = "apipw123";
const yourAPIKey = "b12b84d7-3adb-4bc5-8a73-f65eaa40a53f";
const yourBearerToken = "61a26e4a-64ae-41b0-a773-be0e4f8f2b4e";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "random");
    const result = JSON.stringify(response.data);

    res.render("index.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.get("/basicAuth", async (req, res) => {
  try {
    const myURL = API_URL + "all?page=2";
    const response = await axios.get(myURL, {
      auth: {
        //Authorization Parameters
        username: yourUsername,
        password: yourPassword,
      },
    });
    const result = JSON.stringify(response.data);
    res.render("index.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.get("/apiKey", async (req, res) => {
  try {
    const myURL = "https://secrets-api.appbrewery.com/filter";
    const response = await axios.get(myURL, {
      params: {
        //Query Parameters
        score: 5,
        apiKey: yourAPIKey,
      },
    });
    const result = JSON.stringify(response.data);
    console.log(response);
    res.render("index.ejs", { content: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

const config = { 
  headers: { Authorization: `Bearer ${yourBearerToken}`,  },
};

app.get("/bearerToken", async (req, res) => {
  try {
    const myURL = "https://secrets-api.appbrewery.com/secrets/2";
    const response = await axios.get(myURL, config);
    res.render("index.ejs", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
