const bookshelf = require('./lib/bookshelf');
const {Modifier} = require('../lib/Modifier.js');

const Ability = bookshelf.Model.extend({
  tableName: 'abilities',
});

const abilityFuncs = {
  supercharge: function(player){
    if (!player.activeMonster) {
      return;
    }
    const targetMonster = player.activeMonster;
    if(targetMonster.modifiers.has('aoe')){
      return;
    }
    const description = 'Primary attacks damage all monsters on opponent\'s team.';
    new Modifier(targetMonster, {supercharged: true}, 'aoe', description, (modifier) => {
      if(!this.passiveActive){
        modifier.removeModifier();
      }
    });
  },
  nanomachine_swarm: function(player){
    const {team} = player;
    // loops over each monster in the players team and applies the heal modifier if applicable.
    for(const monsterId in team){
      const curMonster = team[monsterId];
      if(curMonster.creature === 'mecha' && !curMonster.modifiers.has('heal')){
        // heal modifier increases hp by turn until the monster who applied has a false passiveActive
        // or monster to whom it is applied has max hp.
        const description = 'Monster is healed 2 hp per turn until fully healed.';
        new Modifier(curMonster, {}, 'heal', description, (modifier) => {
          if(!this.passiveActive){
            modifier.removeModifier();
          }
          if(curMonster.hp === curMonster.maxHp){
            modifier.removeModifier();
          }
          curMonster.hp += 2;
        });
      }
    }
  },
  electric_shield: function(player){
    if (!player.activeMonster) {
      return;
    }
    const targetMonster = player.activeMonster;
    if(targetMonster.modifiers.has('shield')){
      return;
    }
    const description = `${this.name} takes the first 5 damage ${targetMonster.name} takes each turn.`;
    new Modifier(targetMonster, {protector: this}, 'shield', description, (modifier) => {
      if(!this.passiveActive){
        modifier.removeModifier();
      }
    });
  },
  // Have to set type manually because asynchronous programming would not work here.
  // New types are set with the modifier and removed when the monster is benched.
  pierce: function(player){
    if (!player.activeMonster) {
      return;
    }
    const targetMonster = player.activeMonster;
    if(targetMonster.modifier.has('morph') || targetMonster.type === 'pierce'){
      return;
    }
    const description = 'Changes type to pierce.';
    new Modifier(targetMonster, {type: {id: 1, name: 'pierce', weakness: 2}}, 'morph', description, (modifier) => {
      if(player.activeMonster.bench) modifier.removeModifier();
    });
  },
  crush: function(player){
    if (!player.activeMonster) {
      return;
    }
    const targetMonster = player.activeMonster;
    if(targetMonster.modifier.has('morph') || targetMonster.type === 'crush'){
      return;
    }
    const description = 'Changes type to crush.';
    new Modifier(targetMonster, {type: {id: 2, name: 'crush', weakness: 3}}, 'morph', description, (modifier) => {
      if(targetMonster.bench) modifier.removeModifier();
    });
  },
  spray: function(player){
    if (!player.activeMonster) {
      return;
    }
    const targetMonster = player.activeMonster;
    if(targetMonster.modifier.has('morph') || targetMonster.type === 'spray'){
      return;
    }
    const description = 'Changes type to spray.';
    new Modifier(player.activeMonster, {type: {id: 3, name: 'spray', weakness: 1}}, 'morph', description, (modifier) => {
      if(targetMonster.bench) modifier.removeModifier();
    });
  }
};

module.exports = {Ability, abilityFuncs};
