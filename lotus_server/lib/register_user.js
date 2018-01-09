const dbconfig = require('../knexfile.js')[process.env.DB_ENV];
const knex = require('knex')(dbconfig);
const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');

const register_user = (req, res) => {
  const {email, password} = req.body;
  if(!email || !password){
    res.status(400).status({error: 'A username and password are required'});
    return;
  }
  bcrypt.hash(password, 10, (err, hash) => {
    knex('users').where({email: email})
      .then(users => {
        if (users.length > 0) {
          console.log('A user with that name already exists');
          res.status(501).send(JSON.stringify({error: 'A user with that name already exists'}));
          return;
        }
        knex('users').insert({
          'id': uuidv1(),
          'email': email,
          'password': hash,
          'brouzoff': 200
        }, 'id').then(id => {
          req.session.id = id[0];
          res.status(200).send(JSON.stringify({flash: 'Registration success!'}));
        }).catch((err) => {
          console.log('Promise error in add_user.js', err);
        });
      });
  });
};

module.exports = register_user;
