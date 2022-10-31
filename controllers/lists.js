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
      deleteList: async (req, res) => {
        try {
          await List.remove({ _id: req.params.id });
          console.log("Custom list deleted");
          res.redirect("/profile");
        } catch (err) {
          res.redirect("/profile");
        }
      },
};