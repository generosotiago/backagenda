const express = require('express');
const router = express.Router();
const { showUser } = require('../users/userController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/:id', authMiddleware, showUser);

module.exports = router;
