// Attacks, abilities and their required collections
const {Attack, attackFuncs} = require('../models/attack_model');
const {Ability, abilityFuncs} = require('../models/ability_model');
const Type = require('../models/type_model');

// Monster components, functions so that we can bring everything together into this file.
const Body = require('../models/body_model')(Type);
const Head = require('../models/head_model')(Ability, Attack);
const Arm = require('../models/arm_model')(Attack);
const Monster = require('../models/monster_model')(Body, Head, Arm, Type, Attack, Ability);
const {ModifierCollection} = require('./Modifier.js');

// the monster class
class CompleteMonster {
  constructor(monster, userid){
    // arm and head to be used for image compilation functionality.
    const {body, type} = monster.relations;
    // set attributes
    this.id = monster.attributes.id;
    this.name = monster.attributes.name;
    this.creature = body.attributes.creature;
    this.maxHp = body.attributes.hp;
    this.hp = body.attributes.hp;
    this.type = type.attributes;
    this.accuracy_bonus = body.attributes.accuracy_bonus;
    this.image_url = monster.attributes.image || body.attributes.image_url;
    this.image = monster.attributes.image;
    this.bench = true;
    this.canBench = true;
    this.passiveActive = true;
    this.modifiers = new ModifierCollection();
    this.playerId = userid || null;
  }

  /**
   * takeDamage - Deals damage to monster. Returns an array with the updates the function made
   *
   * @param  {number} damage   the amount of damage to inflict
   * @param  {array} messages  An array of existing messages, optional.
   * @return {array}           Returns an array containing messages.
   */
  takeDamage(damage, messages, isModifier){
    if(!messages) messages = [];
    if(damage < 1){
      return null;
    }
    if(!this.protector || isModifier){
      this.hp -= damage;
      messages.unshift({type:'damage', target: this, value: damage, playerId: this.playerId, message:`${this.name} took ${damage} damage!`});
      return messages;
    }
    // If there is a benched monster protecting this monster. Check damage and effect protector accordingly.
    let protectorDamage = 5;
    if(damage > 5){
      const totalDamage = damage - protectorDamage;
      this.hp -= totalDamage;
      messages.unshift({type:'damage', target: this, value: totalDamage, playerId: this.playerId, message:`${this.name} took ${totalDamage} damage!`});
      this.protector.takeDamage(protectorDamage, messages);
    } else {
      this.protector.takeDamage(damage, messages);
    }
    // filter out null results before sending
    return messages.filter(message => message);
  }
  // Call this function when an attack against this monster misses
  dodged(messages){
    if(!messages) messages = [];
    messages.unshift({type:'miss', target: this, value:'missed', playerId: this.playerId, message:`${this.name} dodges!`});
    return messages;
  }
  // Call this function when an abiliti heals a monster
  healHp(amount, messages){
    this.hp += amount;
    messages.push({type:'heal', target: this, value: amount, playerId: this.playerId, message:`${this.name} healed ${amount} hp!`});
    return messages;
  }
  // call this function when request an attack to be made.
  attack(attackName, idlePlayer){
    const messages = [{type:'animate', value:'attack', target: this, playerId: this.playerId}];
    return this.attacks[attackName].func(idlePlayer, messages);
  }
  set_attacks(attributes, altAttributes) {
    this.attacks = {};
    let {id, name, description} = attributes;
    this.attacks[name] = {id, name, description: description, func: attackFuncs[name].bind(this)};
    if(altAttributes.name){
      let {id, name, description} = altAttributes;
      this.attacks[name]  = {id, name, description: description, func: attackFuncs[name].bind(this), isAlt:true};
    }
  }
  set_ability({name, description}) {
    this.ability = {name, description, func: abilityFuncs[name].bind(this)};
  }
}

const getCreature = (id, userid) => {
  return new Monster({'id': id}).fetch({withRelated: ['body', 'arm', 'head', 'type', 'attack', 'alt_attack', 'ability']}).then(prod => {
    const {attack, alt_attack, ability} = prod.relations;
    const monster = new CompleteMonster(prod, userid);
    // After monster has been created set attacks and abilities
    monster.set_attacks(attack.attributes, alt_attack.attributes);
    if(ability.attributes.name){
      monster.set_ability(ability.attributes);
    }
    return monster;
  }).catch(e => console.log(e));
};

module.exports = getCreature;
