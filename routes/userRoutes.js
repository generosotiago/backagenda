const express = require("express");
const router = express.Router();
const { showUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, showUser);

module.exports = router;
