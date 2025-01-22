const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 5000; // Porta para o servidor local
const uri = "mongodb+srv://admin:admin@cluster0.a8iwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Habilitar CORS para todas as origens (alterar conforme necessário)
app.use(cors());

// Conectar ao MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}

connectToDatabase();

// Rota para salvar agendamento
app.post('/bookings', async (req, res) => {
  const booking = req.body;

  try {
    const database = client.db('bookingDB'); // Nome do banco de dados
    const bookingsCollection = database.collection('bookings'); // Nome da coleção

    // Validar conflito de horários no backend
    const conflict = await bookingsCollection.findOne({
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

    // Inserir novo agendamento
    await bookingsCollection.insertOne(booking);
    res.status(201).json({ message: 'Reserva criada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao salvar reserva.' });
  }
});

// Rota para buscar agendamentos
app.get('/bookings', async (req, res) => {
  try {
    const database = client.db('bookingDB');
    const bookingsCollection = database.collection('bookings');
    const bookings = await bookingsCollection.find({}).toArray();
    res.status(200).json(bookings); // Retorna todos os agendamentos
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
