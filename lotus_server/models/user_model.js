const path = require('path');
const bookshelf = require('./lib/bookshelf');
const uuidv1 = require('uuid/v1');
const monsterMash = require('./monstermash');
const {Team, TeamMonster} = require('./team_model');
// returns a random element from a table
const randomComponent = (collection) => {
  return collection[Math.round(Math.random()*(collection.length-1))];
};

module.exports = (db) => {
  // Make the user model
  const User = bookshelf.Model.extend({
    tableName: 'users',
    team: function(){
      return this.hasMany(Team);
    },
    teamMonster: function(){
      return this.hasMany(TeamMonster).through(Team);
    },
    buyMonster: function(creature, cost){
      const user = this;
      // Returns a promise of a new monster.
      return new Promise(function(resolve){
        user.set({brouzoff: user.attributes.brouzoff - cost});
        user.save().then(() => {
          Promise.all([
            db.select('id','image_url','nameword').from('bodies').where('creature', creature),
            db.select('id','image_url','nameword').from('heads').where('creature', creature),
            db.select('id','image_url','nameword').from('arms').where('creature', creature)
          ]).then(components => {
            const bodies = components[0], heads = components[1], arms = components[2];
            // Make the monster.
            let arm = randomComponent(arms);
            let body = randomComponent(bodies);
            let head = randomComponent(heads);
            let img1 = path.join(__dirname, './parts/'+arm.image_url+'RH.png');
            let img2 = path.join(__dirname, body.image_url);
            let img3 = path.join(__dirname, head.image_url);
            let img4 = path.join(__dirname, './parts/'+arm.image_url+'LH.png');
            let arr = [img1,img2,img3,img4];
            monsterMash(arr).then((result)=> {
              return {
                id: uuidv1(),
                arm_id: arm.id,
                body_id: body.id,
                head_id: head.id,
                name: `${arm.nameword} ${body.nameword}`,
                user_id: user.attributes.id,
                image:result
              };
            }).then(monster => {
              resolve(db('monsters').insert(monster, 'id'));
            });
          });
        });
      });
    }
  });
  return User;
};
