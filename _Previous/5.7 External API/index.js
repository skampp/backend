import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

const options = {
  method: "GET",
  url: "https://api-football-v1.p.rapidapi.com/v3/players",
  params: {
    team: "33",
    league: "39",
    season: "2023",
    // page: 1,
  },
  headers: {
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
    "x-rapidapi-key": "ffa4e87fb7msh0b53b10abe66437p1530f2jsn1c463da93e2f",
  },
};

// app.get("/", async (req, res) => {
//   try {
//     const result = await axios.request(options);
//     const items = result.data.response;
//     console.log("Number of players:", items.length);
//     res.render("index.ejs", { content: items });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get("/", async (req, res) => {
  let allPlayers = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    do {
      const response = await axios.request({
        ...options,
        params: {
          ...options.params,
          page: currentPage
        }
      });

      const players = response.data.response;
      const pagination = response.data.paging;

      console.log(`Fetched page ${currentPage} of ${pagination.total}`);

      allPlayers.push(...players);
      totalPages = pagination.total;
      currentPage++;
    } while (currentPage <= totalPages);

    console.log("Total players fetched:", allPlayers.length);
    res.render("index.ejs", { content: allPlayers });

  } catch (error) {
    console.error("Error fetching players:", error.response?.data || error.message);
    res.status(500).send("Failed to fetch players");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
