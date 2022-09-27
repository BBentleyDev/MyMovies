const mongoose = require("mongoose");

const ToWatchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  dateAdded: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("ToWatch", ToWatchSchema);
