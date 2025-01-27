const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const User = require("./user")

const uri = "mongodb+srv://admin:admin@cluster0.a8iwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Conectado ao MongoDB!");
})
.catch((err) => {
  console.error("Erro ao conectar ao MongoDB:", err);
  process.exit(1);
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); 
    res.status(200).json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

app.use("/api/auth", require("./Auth/Route"));

app.post('/bookings', async (req, res) => {
  const booking = req.body;

  try {
    const Booking = mongoose.model('Booking', new mongoose.Schema({
      room: String,
      date: String,
      startTime: Date,
      endTime: Date
    }));

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
    console.error(err);
    res.status(500).json({ message: 'Erro ao salvar reserva.' });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const Booking = mongoose.model('Booking', new mongoose.Schema({
      room: String,
      date: String,
      startTime: Date,
      endTime: Date
    }));

    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
