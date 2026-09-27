const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: String,
    link: String,
    source: String,
    thumbnail: String,
    date: String,
    category: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", newsSchema);