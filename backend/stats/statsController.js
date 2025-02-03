const Booking = require("../backend/models/booking");
const Room = require("../backend/models/room");
const User = require("../backend/models/user");

const getStats = async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    const roomsCount = await Room.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const usersCount = await User.countDocuments();

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyBookingsCount = await Booking.countDocuments({
      date: { $gte: lastWeek }
    });

    res.status(200).json({
      rooms: roomsCount,
      bookings: bookingsCount,
      users: usersCount,
      week: weeklyBookingsCount
    });

  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ message: "Erro ao obter estatísticas." });
  }
};

module.exports = { getStats };
