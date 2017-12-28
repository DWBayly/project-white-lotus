// Server setup
const buildMonstersJSON = require('../lib/build_monsters_json');
const buildMonsterJSON = require('../lib/build_monster_json');
const express = require('express');
const getCreature = require('../lib/generate_monster.js');
module.exports = (db) => {
  const User = require('../models/user_model')(db);
  const monsterRouter = express.Router();
  // Find monsters so they can be fetched by React Monsters component
  monsterRouter.get('/', (req, res) => {
    if(!req.cookies.id) res.status(400).send();
    // Get all monster IDs
    buildMonstersJSON(res, req.cookies.id)
  });

  // For deleting a monster
  monsterRouter.delete('/:id', (req, res) => {
    const {id} = req.params
    db('monsters').where('id', id).del().then(monster => {
      res.send(JSON.stringify({flash: `Monster ${id} has been deleted.`}))
    });
  });

  // Find a single monster so it can be fetched by React Monster component
  monsterRouter.get('/:id', (req, res) => {
    buildMonsterJSON(res, req.params.id);
  });

  // For creating a new monster.
  monsterRouter.post('/', (req, res) => {
    const {id} = req.cookies;
    const {creature, cost} = req.body;

    if (!creature || !id){
      return;
    }
    // Pull the user model and buy dat monster
    new User({id}).fetch().then(user => {
      if (user.attributes.brouzoff < cost){
        res.send(JSON.stringify({error: 'Sorry, not enough Brouzoff'}));
        return;
      }
      user.buyMonster(creature, cost).then(monster => {
        const monsterId = monster[0];
        getCreature(monsterId).then(monster => {
          res.send(JSON.stringify({monster, brouzoff: user.attributes.brouzoff}));
        });
      });
    });
  });

  // For updating monster name
  monsterRouter.put('/:id', (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    if(!name){
      return;
    }
    db('monsters').update({name: name}).where('id', id).then(() => {
      db('monsters').where('id', id).then(monster => {
        res.send(JSON.stringify(monster[0]));
      });
    });
  });

  return monsterRouter;
};
