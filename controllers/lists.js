const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const ToWatch = require("../models/toWatch");
const Journal = require("../models/Journal");
const List = require("../models/List");
const baseUrl = 'https://api.themoviedb.org/3/'

module.exports = {
    likeList: async (req, res) => {
        try {
          await List.findOneAndUpdate(
            { _id: req.params.id },
            {
              $inc: { likes: 1 },
            }
          );
          console.log("Likes +1");
          res.redirect(`back`);
        } catch (err) {
          console.log(err);
        }
      },
};