const uuid = require('uuid/v1');
// Takes an active monster, an object of attributesToChange and an update functions
// it will add the modifier to the modifiers collection on first argument monster.
// Each turn, the modifier's update function will be called, taking itself, and the current game messages as arguments.
// see modifier.test.js for a use case.
class Modifier{
  constructor(monster, attributesToChange, modifierName, description, updateFunction){
    this.id = uuid();
    this.name = modifierName;
    this.description = description;
    this.savedAttributes = {};
    // change monster attributes
    for(const attribute in attributesToChange){
      const attributeValue = attributesToChange[attribute];
      this.savedAttributes[attribute] = monster[attribute];
      monster[attribute] = attributeValue;
    }

    this.update = (messages) => {
      return updateFunction(this, messages);
    };
    monster.modifiers[this.id] = this;

    /**
     * removeModifier - resets the monsters attributes and then deletes the modifier from the monster's modifier collection.
     */
    this.removeModifier = () => {
      // Reset monster attributes.
      for(const attribute in this.savedAttributes){
        const savedAttributeValue = this.savedAttributes[attribute];
        monster[attribute] = savedAttributeValue;
      }
      delete monster.modifiers[this.id];
    };
  }
}

class ModifierCollection{

  /**
   * forEach - Loops over each modifier in a collection. Each iteration, it calls a callback with the modifier as an argument.
   *
   * @param  {function} callback  function that will be called each iteration, passing the current modifier.
   */
  forEach(callback){
    for(const key in this){
      callback(this[key]);
    }
  }

  /**
   * length - Gets the number of modifiers a collection has.
   *
   * @return {number}  The number of modifiers in the collection it is a method of.
   */
  length(){
    return Object.keys(this).length;
  }

  /**
   * has - checks if a modifier collection has a certain modifier, by name.
   *
   * @param  {string} name  the name of the modifier type you'd like to check in on.
   * @return {boolean}
   */
  has(name){
    let result = false;
    this.forEach((modifier) => {
      if(modifier.name === name){
        result = true;
      }
    });
    return result;
  }
}

module.exports = {Modifier, ModifierCollection};
