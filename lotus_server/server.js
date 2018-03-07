// Server setup/dependencies
require('dotenv').config();
const express = require('express');
const server = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

// Database setup
const dbconfig = require('./knexfile.js')[process.env.DB_ENV];
const knex = require('knex')(dbconfig);

// Routes
const socketRouter = require('./routes/battles_routes')(server);
const monsterRouter = require('./routes/monster_routes')(knex);
const userRouter = require('./routes/user_routes')(knex);

// Functions
const loginUser = require('./lib/login_user')(knex);

// Middleware
// Serve static files from the React app
server.use(express.static(path.join(__dirname, '../build')));
server.use(express.static(path.join(__dirname, './dist')));
// Body Parser
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// Cookie Session
server.use(cookieSession({
  name: 'id',
  keys: ['spider', 'pie', 'issue']
}));

// Routes
server.use('/battles', socketRouter);
server.use('/monsters', monsterRouter);
server.use('/user', userRouter);
server.post('/login', loginUser);
server.delete('/logout', (req, res) => {
  req.session = null;
  res.status(200).send(JSON.stringify({flash: 'logout successful'}));
});
server.get('/teams', (req, res) => {
  console.log('teams is sending index.html');
  res.sendFile('/index.html');
});

// For safety
server.get('/create-battle', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
server.get('/join-battle', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
server.get('/teams', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
server.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

server.listen(PORT, '0.0.0.0', 'localhost', () => {
  console.log(`Listening on ${PORT}`);
});
