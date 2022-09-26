const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", upload.single("file"), postsController.createPost);

router.post("/addToJournal", postsController.addToJournal);

router.post("/addToWatchList", postsController.addToWatchList);

router.put("/likePost/:id", postsController.likePost);

router.delete("/deletePost/:id", postsController.deletePost);

router.delete("/deleteFromWatchlist/:id", postsController.deleteFromWatchlist);

router.put("/editJournal/:id", postsController.editJournal);

module.exports = router;
