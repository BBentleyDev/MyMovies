const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  dateWatched: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
  comments: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Journal", JournalSchema);