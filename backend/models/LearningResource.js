const mongoose = require("mongoose");

const learningResourceSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
    },
    title: String,
    link: String,
    source: String,
    thumbnail: String,
    resourceType: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LearningResource",
  learningResourceSchema
);