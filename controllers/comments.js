const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        list: req.params.id,
        createdBy: req.user.userName,
        createdAt: new Date().toLocaleDateString(),
      });
      console.log("Comment has been added!");
      res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  }
};