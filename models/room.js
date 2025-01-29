const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  size: {
    type: String,
  },
  description: {
    type: String,
  },
  exclusive: {
    type: Boolean,
  },
  status: {
    type: Boolean,
  },
});

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
