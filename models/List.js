const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("List", ListSchema);