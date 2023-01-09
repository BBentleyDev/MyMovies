const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  movieId: {
    type: Number,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Journal", JournalSchema);