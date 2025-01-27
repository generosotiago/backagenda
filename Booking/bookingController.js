const Booking = require('../models/booking');

const createBooking = async (req, res) => {
  const booking = req.body;

  try {
    const conflict = await Booking.findOne({
      room: booking.room,
      date: booking.date,
      $or: [
        { startTime: { $lt: booking.endTime, $gte: booking.startTime } },
        { endTime: { $gt: booking.startTime, $lte: booking.endTime } },
      ],
    });

    if (conflict) {
      return res.status(409).json({ message: 'Conflito de horários para essa sala.' });
    }

    await new Booking(booking).save();
    res.status(201).json({ message: 'Reserva criada com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar reserva:', err);
    res.status(500).json({ message: 'Erro ao salvar reserva.' });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
};

module.exports = { createBooking, getBookings };
