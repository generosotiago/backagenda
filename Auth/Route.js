const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register } = require('./Auth');
const { login } = require('./Auth');
const { editUser } = require('./Auth')
const { deleteUser } = require('./Auth');

router.route('/register').post(authMiddleware, register);
router.route('/login').post(login);
router.route('/deleteUser').delete(authMiddleware, deleteUser);
router.route('/editUser').put(editUser);

module.exports = router;
