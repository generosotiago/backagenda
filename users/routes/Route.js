const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { register } = require('../../controllers/Auth');
const { login } = require('../../controllers/Auth');
const { editUser } = require('../../controllers/Auth');
const { deleteUser } = require('../../controllers/Auth');

router.route('/register').post(authMiddleware, register);
router.route('/login').post(login);
router.route('/deleteUser').delete(authMiddleware, deleteUser);
router.route('/editUser').put(editUser);

module.exports = router;
