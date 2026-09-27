const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { getJson } = require("serpapi");
require("dotenv").config();

const News = require("./models/News");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error);
  });

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Career Discovery Backend is running 🚀",
  });
});

// News route
app.get("/api/news", async (req, res) => {
  try {
    // Check 24-hour cache
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const cachedNews = await News.find({
      createdAt: {
        $gte: twentyFourHoursAgo,
      },
    }).sort({ createdAt: -1 });

    // If cache exists, don't call SerpApi
    if (cachedNews.length > 0) {
      console.log("Serving news from MongoDB 💾");

      return res.json({
        source: "cache",
        news: cachedNews,
      });
    }

    // Cache empty/expired → SerpApi
    console.log("Fetching fresh news from SerpApi 🔍");

    const results = await getJson({
      engine: "google_news",
      q: "technology career",
      api_key: process.env.SERPAPI_KEY,
    });

    const newsResults = results.news_results || [];

    const formattedNews = newsResults.map((item) => ({
      title: item.title,
      link: item.link,
      source: item.source?.name || "",
      thumbnail: item.thumbnail || "",
      date: item.date || "",
      category: "Technology & Career",
    }));

    // Remove old cached news
    await News.deleteMany({});

    // Store fresh news
    if (formattedNews.length > 0) {
      await News.insertMany(formattedNews);
    }

    res.json({
      source: "serpapi",
      news: formattedNews,
    });
  } catch (error) {
    console.error("News Error ❌", error);

    res.status(500).json({
      message: "Failed to fetch news",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});