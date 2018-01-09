// Server setup/dependencies
require('dotenv').config();
const express = require('express');
const server = express();
const PORT = 3001;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
// Body Parser
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// Cookie Parser
server.use(cookieParser());
server.use(cookieSession({
  name: 'id',
  keys: ['spider', 'pie', 'issue']
}));
server.use(express.static('dist'));

server.use('/battles', socketRouter);
server.use('/monsters', monsterRouter);
server.use('/user', userRouter);
server.post('/login', loginUser);
server.delete('/logout', (req, res) => {
  req.session = null;
  res.status(200).send(JSON.stringify({flash: 'logout successful'}));
});

server.listen(PORT, '0.0.0.0', 'localhost', () => {
  console.log(`Listening on ${PORT}`);
});
