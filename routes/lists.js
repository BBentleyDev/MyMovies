const express = require("express");
const router = express.Router();
const listsController = require("../controllers/lists");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.put("/likeList/:id", ensureAuth, listsController.likeList);

router.delete("/deleteList/:id", ensureAuth, listsController.deleteList);

module.exports = router;