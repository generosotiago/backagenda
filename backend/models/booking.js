const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  description: String,
  room: String,
  date: String,
  startTime: Date,
  endTime: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
