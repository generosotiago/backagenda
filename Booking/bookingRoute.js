const express = require('express');
const { createBooking, getBookings } = require('./bookingController');
const router = express.Router();

router.post('/', createBooking);  
router.get('/', getBookings);    
module.exports = router;
