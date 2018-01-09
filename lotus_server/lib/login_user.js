const bcrypt = require('bcrypt');

const loginUser = (knex) => {
  return (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
      res.send(JSON.stringify({error:'Both a username and a password are required.'}));
      return;
    }
    knex.table('users').first('id','email','brouzoff','password').where('email',email)
      .then(user => {
        if(!user){
          res.send(JSON.stringify({error:'The username or password entered doesn\'t match our records.'}));
          return;
        }
        // Check password info
        bcrypt.compare(password, user.password, (err, result) => {
          if(result){
            req.session.id = user.id;
            res.status(200).send(JSON.stringify({flash: 'Login success!'}));
            return;
          }
          res.send(JSON.stringify({error:'The username or password entered doesn\'t match our records.'}));
        });
      });
  };
};

module.exports = loginUser;
