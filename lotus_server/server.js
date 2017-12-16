'uses strict';

require('dotenv').config();
const generatePlayer = require('./lib/generate_player.js');
const getCreature = require('./models/monster_builder');
const express = require('express')
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const server = express();


const getMonsters = require('./models/monster_builder');
const dbconfig = require('./knexfile.js')[process.env.DB_ENV];
const knex = require('knex')(dbconfig);
const bodyParser = require('body-parser')

const PORT = 3001;

// WebSocket
const wss = new SocketServer({ server });
wss.on('connection', (ws) => {
  console.log("A client connected");

  ws.on('close', () => {
    console.log("A client disconnected");
  });
});

server.use(bodyParser.urlencoded({ extended: false }))

server.get('/battle/:id', (req, res) => {
  console.log(req.query);
  generatePlayer(req.query.userid, req.query.team.split('')).then(team => {
    res.send(JSON.stringify(team));
  });

});

// Find monsters so they can be fetched by React App component
server.get('/monsters', (req, res) => {
  // Get all monster IDs
  knex.from('monsters').column('id')
    .then(ids => {
      const monsterIDs = [];
      for (let index of ids) {
        // Create promise with a complete monster associated with each ID
        monsterIDs.push(getMonsters(index.id));
      }
      // When all promises are made, send as JSON to App
      Promise.all(monsterIDs).then(results => {
        res.send(JSON.stringify(results));
      });
    });
});

server.listen(PORT, '0.0.0.0', 'localhost', () => {
  console.log(`Listening on ${PORT}`);
});
