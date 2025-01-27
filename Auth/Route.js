const express = require("express")
const router = express.Router()
const { register } = require("./Auth")
const { login } = require("./Auth")
const { deleteUser } = require("./Auth")  


router.route("/register").post(register)
module.exports = router;

router.route("/login").post(login);
module.exports = router;

router.route("/deleteUser").delete(deleteUser);