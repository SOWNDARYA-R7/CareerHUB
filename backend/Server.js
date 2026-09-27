const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getJson } = require("serpapi");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Career Discovery Backend is running 🚀",
  });
});

app.get("/api/news", async (req, res) => {
  try {
    const results = await getJson({
      engine: "google_news",
      q: "technology career",
      api_key: process.env.SERPAPI_KEY,
    });

    res.json(results);
  } catch (error) {
    console.error("SerpApi Error:", error);
    res.status(500).json({
      message: "Failed to fetch news",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});