const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { register } = require("../controllers/authController");
const { login } = require("../controllers/authController");
const { editUser } = require("../controllers/authController");
const { deleteUser } = require("../controllers/authController");

router.route("/register").post(authMiddleware, register);
router.route("/login").post(login);
router.route("/deleteUser").delete(authMiddleware, deleteUser);
router.route("/editUser").put(editUser);

module.exports = router;
