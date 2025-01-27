const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
require('dotenv').config();


const uri = "mongodb+srv://admin:admin@cluster0.a8iwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

app.use(bodyParser.json());
app.use(cors());

app.use('/bookings', require('./Booking/bookingRoute'));
app.use("/api/auth", require("./Auth/Route"));

const User = require("./models/user");

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
