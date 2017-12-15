'uses strict';

require('dotenv').config();
const generatePlayer = require('./lib/generate_player.js');
const express = require('express')
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;
const server = express();


const dbconfig = require('./knexfile.js')[process.env.DB_ENV];
const knex = require('knex')(dbconfig);
const bodyParser = require('body-parser')
server.use(bodyParser.urlencoded({ extended: false }))


const expressws = require('express-ws')(server);
const PORT = 3001;
server.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

server.get('/battle/:id', function(req, res, next){
  console.log('get route', req.testing);
  if(!this.exampleSocket){
   this.exampleSocket = new WebSocket("ws://localhost:3001/battle/"+req.params.id);
   this.exampleSocket.onmessage = function (event) {
    console.log(event.data);
   }

  }else if(this.exampleSocket.readyState===1){
    this.exampleSocket.send("Hello World");
  }else{
    console.log(this.exampleSocket.readyState);
  }
  console.log(req.query);
  res.send("Welcome to battles");
  /*if(req.query!==null){
     console.log(req.query);
     generatePlayer(req.query.monsters.split('')).then(team => {
        res.send(JSON.stringify(team));
      });
  }else{
    req.end();
  }*/
});
server.ws('/battle/:id', function(ws, req) {
  let game = {}
  ws.on('message', function(msg) {
    console.log(msg);
    ws.send("Echo from /battle/"+req.params.id+":"+msg);
  });
});
server.listen(PORT);


server.get('/monsters', (req, res) => {
  knex.from('monsters')
    .then(monsters => {
      for (let monster in monsters) {
        // console.log(monster, monsters[monster]);
      }
      res.json(monsters);
    });
});

/*server.listen(PORT, '0.0.0.0', 'localhost', () => {
  console.log(`Listening on ${PORT}`);
});*/

// WebSocket
/*const wss = new SocketServer({ server });
wss.on('connection', (ws) => {
  console.log("A client connected");
  ws.on('close', () => {
    console.log("A client disconnected");
  });
});*/