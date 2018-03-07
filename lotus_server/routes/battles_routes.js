// Server setup
const express = require('express');
const expressws = require('express-ws');
const socketFunctions = require('./socket_functions');
const path = require('path');

module.exports = (server) => {
  const wss = expressws(server);
  const socketRouter = express.Router();
  // generates a room
  socketRouter.genBattle = function(id){
    const roomFunctionality = socketFunctions(wss, id);
    this.ws(`/${id}`, roomFunctionality);
    // For testing whether a room exists on the client side.
    this.get(`/${id}/exists`, (req, res) => {
      res.send({flash: 'Sorry, this room already exists.'});
    });
  };
  socketRouter.get('/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
  });
  socketRouter.post('/',(req,res) => {
    const {roomName} = req.body;
    socketRouter.genBattle(roomName);
    res.send(JSON.stringify({flash:`/battles/${roomName}`}));
  });
  return socketRouter;
};
