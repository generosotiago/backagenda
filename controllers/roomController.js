const Room = require("../models/room");

const createRoom = async (req, res) => {
  const { name, size, description, exclusive, status } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const room = new Room({ name, size, description, exclusive, status });
    await room.save();
    res.status(201).json({ message: "Sala criada com sucesso", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar a sala" });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar salas" });
  }
};

const updateRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Sala não encontrada" });
    }

    Object.assign(room, req.body);
    await room.save();
    res.json({ message: "Sala atualizada com sucesso", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar a sala" });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: "Sala não encontrada" });
    }

    await room.remove();
    res.json({ message: "Sala deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar a sala" });
  }
};

const getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    id;
    if (!room) {
      return res.status(404).json({ error: "Sala não encontrada" });
    }
    res.json(room);
  } catch (err) {
    console.error("Erro ao buscar sala:", err);
    res.status(500).json({ message: "Erro ao buscar sala" });
  }
};

module.exports = { createRoom, getRooms, updateRoom, deleteRoom, getRoomById };
