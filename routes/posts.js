const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now

router.get("/details/:id", ensureAuth, postsController.getDetails);

router.get("/customlist/:id", ensureAuth, postsController.getCustomList);

router.post("/addToJournal", postsController.addToJournal);

router.post("/addToWatchList", postsController.addToWatchList);

router.delete("/deleteFromWatchlist/:id", postsController.deleteFromWatchlist);

router.delete("/deleteFromJournal/:id", postsController.deleteFromJournal);

router.put("/editJournal/:id", postsController.editJournal);

module.exports = router;
