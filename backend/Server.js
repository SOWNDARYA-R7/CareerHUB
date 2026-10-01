const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { getJson } = require("serpapi");
require("dotenv").config();

const News = require("./models/News");
const LearningResource = require("./models/LearningResource");

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

function detectResourceType(title, link, source) {
  const text = `${title} ${link} ${source}`.toLowerCase();

  // Video
  if (
    text.includes("youtube") ||
    text.includes("youtu.be") ||
    text.includes("video")
  ) {
    return "Video";
  }

  // Course
  if (
    text.includes("coursera") ||
    text.includes("udemy") ||
    text.includes("edx") ||
    text.includes("course") ||
    text.includes("training")
  ) {
    return "Course";
  }

  // Tutorial
  if (
    text.includes("geeksforgeeks") ||
    text.includes("w3schools") ||
    text.includes("tutorial") ||
    text.includes("guide") ||
    text.includes("how to") ||
    text.includes("how-to")
  ) {
    return "Tutorial";
  }

  // Documentation
  if (
    text.includes("documentation") ||
    text.includes("docs") ||
    text.includes("developer") ||
    text.includes("reference")
  ) {
    return "Documentation";
  }

  // Project
  if (
    text.includes("github") ||
    text.includes("gitlab") ||
    text.includes("repository") ||
    text.includes("project")
  ) {
    return "Project";
  }

  return "Article";
}


app.get("/api/learning", async (req, res) => {
  try {
    const { domain } = req.query;
    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = 10;

    if (!domain || !domain.trim()) {
      return res.status(400).json({
        message: "Domain is required",
      });
    }

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        message: "Page must be a positive number",
      });
    }

    const cleanDomain = domain.trim().toLowerCase();
    const start = (page - 1) * limit;

    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    // Check cache for this specific domain and page
    const cachedResources = await LearningResource.find({
      domain: cleanDomain,
      page,
      createdAt: { $gte: twentyFourHoursAgo },
    }).sort({ createdAt: 1 });

    if (cachedResources.length > 0) {
      console.log(`Learning cache hit: ${cleanDomain}, page ${page} 💾`);

      return res.json({
        source: "cache",
        domain: cleanDomain,
        page,
        limit,
        resources: cachedResources,
        hasMore: cachedResources[0].hasMore,
      });
    }

    console.log(`Fetching ${cleanDomain}, page ${page} from SerpApi 🔍`);

    const results = await getJson({
      engine: "google",
      q: `${cleanDomain} learning resources courses tutorials videos pdf files`,
      start,
      num: limit,
      api_key: process.env.SERPAPI_KEY,
      timeout: 30000,
    });

    const organicResults = results.organic_results || [];
     
    const hasMore = Boolean(results.serpapi_pagination?.next);

    const formattedResources = organicResults.slice(0, limit).map((item) => ({
      domain: cleanDomain,
      page,
      hasMore,
      title: item.title || "",
      link: item.link || "",
      source: item.source || "",
      thumbnail: item.thumbnail || "",
      resourceType: detectResourceType(
        item.title || "",
        item.link || "",
        item.source || ""
      ),
    }));

    // Remove only expired records for this domain and page
    await LearningResource.deleteMany({
      domain: cleanDomain,
      page,
      createdAt: { $lt: twentyFourHoursAgo },
    });

    if (formattedResources.length > 0) {
      await LearningResource.insertMany(formattedResources);
    }

    return res.json({
      source: "serpapi",
      domain: cleanDomain,
      page,
      limit,
      resources: formattedResources,
      hasMore,
    });
  } catch (error) {
    console.error("Learning API Error ❌", error);

    return res.status(500).json({
      message: "Failed to fetch learning resources",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});