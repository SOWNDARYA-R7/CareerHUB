
const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    locations: {
      type: [String],
      required: true,
    },
    cacheKey: {
      type: String,
      required: true,
      unique: true,
    },
    internships: [
      {
        title: String,
    company: String,
    location: String,
    workMode: String,
    description: String,
    link: String,
    source: String,
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);