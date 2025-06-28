// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

const yourUsername = "cmartin3webdev";
const yourPassword = "apipw123";
const yourAPIKey = "b12b84d7-3adb-4bc5-8a73-f65eaa40a53f";
const yourBearerToken = "61a26e4a-64ae-41b0-a773-be0e4f8f2b4e";
// 3. Use the public folder for static files.
app.use(express.static("public"));
// 4. When the user goes to the home page it should render the index.ejs file.
app.get("/", async (req, res) => {
    try {
    const result = await axios.get(API_URL + "/random");
    const response = result.data;
    res.render("index.ejs", { content: response });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
//   res.render("index.ejs");
});
// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});