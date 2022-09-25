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
//   overview: {
//     type: String,
//     required: true,
//   },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ToWatch", ToWatchSchema);
