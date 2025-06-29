//I am able to call in information, but the search doesn't work as described in the API - even
//when going straight through the website.  Abandoning, but I've learned a lot.  Choosing a
//different API for the project.

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://search.idigbio.org/v2/search/records";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  //This doesn't seem to be working... on initial page load, tons of stuff populate when they should not.
  //I think on the const result = line, since there is no configCat defined, it loads the entire dataset.
  //What can I do to say, hey, this hasn't been initialized yet, don't do anything but load the form?
  try {
    var configConcat = "{rq: {";
    if (req.body.stateprovince && req.body.stateprovince.length > 0) {
      configConcat = configConcat + req.body.stateprovince;
    }
    if (req.body.kingdom && req.body.kingdom.length > 0) {
      configConcat = configConcat + req.body.kingdom;
    }
    configConcat =
      configConcat +
      "}, fields: ['stateprovince', 'catalognumber', 'scientificname', 'kingdom'], };";

    if (req.body.stateprovince || req.body.kingdom) {
    
      const result = await axios.post(API_URL, configConcat);
    // const response = JSON.stringify(result.data, null, 2);
    const items = result.data.items;
    res.render("index.ejs", { content: items });

    items.forEach((item, i) => {
      console.log(items[i].indexTerms.scientificname);

    });
    } else {
      res.render("index.ejs");
    }
    console.log("Initial Pass: " + configConcat);
  } catch (error) {
    console.log(error);
  }
});

app.post("/", async (req, res) => {
  try {
    var configConcat = "?rq:{";
    if (req.body.stateprovince && req.body.stateprovince.length > 0) {
      configConcat = configConcat + "'stateprovince':'" + req.body.stateprovince + "',";
    }
    if (req.body.kingdom && req.body.kingdom.length > 0) {
      configConcat = configConcat + "'kingdom':'" +  req.body.kingdom + "',";
    }
    configConcat = configConcat + "}";
    // configConcat =
    //   configConcat +
    //   "}, fields: ['stateprovince', 'catalognumber', 'scientificname', 'kingdom'], };";
console.log("Reload: " + API_URL+configConcat);


//going for:
// https://search.idigbio.org/v2/search/records/?rq={"scientificname":"puma+concolor"}
// { = %7B, " = %22, : = %3A, } = %7D

    // const result = await axios.post(API_URL, configConcat);
    const result = await axios.get(API_URL + configConcat);
    const items = result.data.items;
    res.render("index.ejs", { content: items });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
