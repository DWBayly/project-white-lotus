const bookshelf = require('./lib/bookshelf');

const Attack = bookshelf.Model.extend({
  tableName: 'attacks',
});

const attackFuncs = {
  scratch: function(attackedPlayer){
    // Attacks return a function which calls a state change on an object.
    const damage = 1;
    attackedPlayer.activeMonster.takeDamage(damage);
    // We set the player turn here because, so it's optional.
    return [`${attackedPlayer.activeMonster.name} took ${damage} damage! They have ${attackedPlayer.activeMonster.hp} hp!`]
  }
};

module.exports = {Attack, attackFuncs};
