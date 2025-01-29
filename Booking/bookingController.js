const Booking = require("../models/booking");
const mongoose = require('mongoose');
const authenticateJWT = require("../middleware/authMiddleware");

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: 'tiagogeneroso47@gmail.com',
    pass: 'lsgo ozlp zoaa afst', 
  },
});

const createBooking = async (req, res) => {
  if (!req.userId) {
    return res.status(400).json({ message: 'Usuário não autenticado' });
  }

  const booking = req.body;
  booking.user = req.userId;  

  if (
    !booking.description ||
    !booking.room ||
    !booking.date ||
    !booking.startTime ||
    !booking.endTime
  ) {
    return res.status(400).json({
      message:
        "Todos os campos (description, room, date, startTime, endTime) são obrigatórios.",
    });
  }

  const [day, month, year] = booking.date.split("/"); 
  const formattedDate = `${year}-${month}-${day}`;
  booking.date = formattedDate;

  const startTime = new Date(`${formattedDate}T${booking.startTime}:00`);
  const endTime = new Date(`${formattedDate}T${booking.endTime}:00`);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return res.status(400).json({ message: "Start time e end time devem ser datas válidas." });
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
      return res.status(409).json({ message: "Conflito de horários para essa sala." });
    }
    const newBooking = await new Booking(booking).save();
    const populatedBooking = await Booking.findById(newBooking._id).populate('user', 'email name');
    console.log("Usuário associado à reserva:", populatedBooking.user);
    const mailOptions = {
      from: 'vidanovaoficial@gmail.com',
      to: populatedBooking.user.email, 
      subject: 'Reserva Confirmada',
      text: `Olá ${populatedBooking.user.name}, sua reserva foi confirmada:
      Sala: ${populatedBooking.room}
      Descrição: ${populatedBooking.description}
      Data: ${populatedBooking.date}
      Início: ${populatedBooking.startTime.toLocaleTimeString()}
      Fim: ${populatedBooking.endTime.toLocaleTimeString()}
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Reserva criada com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar reserva:", err);
    res.status(500).json({ message: "Erro ao salvar reserva." });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user');  
    res.status(200).json(bookings); 
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Reserva não encontrada" });
    }

    await booking.remove();
    res.status(200).json({
      message: "Reserva deletada com sucesso",
      booking: { id: booking._id, description: booking.description },
    });
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    res.status(500).json({
      message: "Erro ao deletar reserva",
      error: error.message,
    });
  }
};

const editBooking = async (req, res) => {
  const { id } = req.params;  
  const updatedData = req.body; 

  if (
    !updatedData.description ||
    !updatedData.room ||
    !updatedData.date ||
    !updatedData.startTime ||
    !updatedData.endTime
  ) {
    return res.status(400).json({
      message:
        "Todos os campos são obrigatórios.",
    });
  }

  const [day, month, year] = updatedData.date.split("/");
  const formattedDate = `${year}-${month}-${day}`;
  updatedData.date = formattedDate;

  const startTime = new Date(`${formattedDate}T${updatedData.startTime}:00`);
  const endTime = new Date(`${formattedDate}T${updatedData.endTime}:00`);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return res.status(400).json({ message: "Start time e end time devem ser datas válidas." });
  }

  updatedData.startTime = startTime;
  updatedData.endTime = endTime;

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Reserva não encontrada" });
    }

    const conflict = await Booking.findOne({
      room: updatedData.room,
      date: updatedData.date,
      $or: [
        { startTime: { $lt: updatedData.endTime, $gte: updatedData.startTime } },
        { endTime: { $gt: updatedData.startTime, $lte: updatedData.endTime } },
      ],
    });

    if (conflict) {
      return res.status(409).json({ message: "Conflito de horários para essa sala." });
    }

    await Booking.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({
      message: "Reserva atualizada com sucesso",
      booking: { id, description: updatedData.description },
    });
  } catch (err) {
    console.error("Erro ao atualizar reserva:", err);
    res.status(500).json({ message: "Erro ao atualizar reserva." });
  }
};

module.exports = {
  createBooking: [authenticateJWT, createBooking],
  getBookings,
  deleteBooking,
  editBooking
};
