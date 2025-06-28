import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://search.idigbio.org/v2/search/records/";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const config = {
      rq: {
        stateprovince: "new york",
      },
      fields: ["stateprovince", "catalognumber", "scientificname"],
      //see if I can find something more interesting to log.
      limit: 5
    };

    const result = await axios.post(API_URL, config);
    // const response = JSON.stringify(result.data, null, 2);
    const items = result.data.items;
    res.render("index.ejs", { content: items });

    items.forEach((item, i) => {
      console.log(items[i].indexTerms.scientificname);
      //translate this a loop to the index.ejs page.

      console.log (result);
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
