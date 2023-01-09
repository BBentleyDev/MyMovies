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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateAdded: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("ToWatch", ToWatchSchema);
