const express = require('express');
const router = express.Router();
const roomController = require('../Rooms/roomController');

router.post('/', roomController.createRoom);
router.get('/', roomController.getRooms);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);
router.get('/:id', roomController.getRoomById);  


module.exports = router;