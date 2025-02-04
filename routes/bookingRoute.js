const express = require('express');
const { createBooking, getBookings, deleteBooking, editBooking } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', createBooking);  
router.get('/', getBookings);    
router.delete('/deleteBooking/:id', deleteBooking);
router.put('/editBooking/:id', editBooking)

module.exports = router;
