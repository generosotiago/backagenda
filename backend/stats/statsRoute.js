const express = require('express');
const router = express.Router();
const { getStats } = require('../stats/statsController'); 
const authMiddleware = require('../backend/middleware/authMiddleware');

router.get('/', authMiddleware, getStats); 

module.exports = router;
