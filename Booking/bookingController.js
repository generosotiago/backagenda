const Booking = require('../models/booking');
const authenticateJWT = require('../middleware/authMiddleware'); 

const createBooking = async (req, res) => {
  const booking = req.body;

  if (!booking.description || !booking.room || !booking.date || !booking.startTime || !booking.endTime) {
    return res.status(400).json({ message: 'Todos os campos (description, room, date, startTime, endTime) são obrigatórios.' });
  }

  const [day, month, year] = booking.date.split('/');
  const formattedDate = `${year}-${month}-${day}`;
  booking.date = formattedDate;

  const startTime = new Date(`${formattedDate}T${booking.startTime}:00`);
  const endTime = new Date(`${formattedDate}T${booking.endTime}:00`);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return res.status(400).json({ message: 'Start time e end time devem ser datas válidas.' });
  }

  booking.startTime = startTime;
  booking.endTime = endTime;

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

module.exports = { createBooking: [authenticateJWT, createBooking], getBookings };
