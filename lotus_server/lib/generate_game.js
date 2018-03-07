const generatePlayer = require('./generate_player');

class Game{
  constructor(players){
    this.players = players;
    // First player to join given first turn.
    this.players[0].turn = true;
    this.activePlayer = null;
    this.idlePlayer = null;
    this.gameOver = false;
    this.findActivePlayer();
  }
  // Used to execute attack abilities. Options are optional.
  // actionObj = {action:'attack', name:{{attack_name}}, [options:{options}]}
  attack(actionObj){
    const {activePlayer, idlePlayer} = this;
    const {name} = actionObj;
    return activePlayer.activeMonster.attack(name, idlePlayer);
  }
  // used to execute all passive abilities of monsters with their passive's active. This can include monsters on the field.
  // Messages given in the takeAction function to make it easier to use in the modifier update functions
  passive(player, messages){
    if(!player.activeMonster) return;
    const {team} = player;
    for(let monsterId in team){
      const monster = team[monsterId];
      if(monster.bench && monster.passiveActive && monster.ability){
        monster.ability.func(player);
      }
      // Loop over each modifier and update them. But only for the current active player.
      if(player === this.activePlayer){
        monster.modifiers.forEachBackwards(modifier => {
          modifier.update(messages);
        });
      }
    }
  }
  // this is used to execute position shifts, takes the id of the monster through the action object
  // actionObj = {action:'activate', id:{monster_id}}
  activate(actionObj){
    const {activePlayer} = this;
    const monsterId = actionObj.monsterId;
    if(!monsterId){
      return;
    }
    return activePlayer.activateMonster(monsterId);
  }
  switchTurns(){
    this.idlePlayer.checkForDeath();
    this.activePlayer.checkForDeath();
    this.activePlayer.turn = false;
    this.idlePlayer.turn = true;
  }
  // Sets this.activePlayer and this.idlePlayer to the appropriate player. Used for turns.
  findActivePlayer(){
    for(const player of this.players){
      if(player.team.aliveMonsters().length === 0){
        const losingPlayerIndex = this.players.indexOf(player);
        const winningPlayerIndex = 1 - losingPlayerIndex;
        this.gameOver = {winner:this.players[winningPlayerIndex], loser: this.players[losingPlayerIndex]};
        return;
      }
      // executes passives and push the returning message to the messages list.
      player.turn ? this.activePlayer = player : this.idlePlayer = player;
    }
  }
  takeAction(actionObj){
    const {action} = actionObj;
    // Takes the action given in the actionObj and runs it, creating the initial message array.
    let messages = this[action](actionObj) || [];
    // After action is over, switchTurns and check active players and run passives.
    for(const player of this.players){
      this.passive(player, messages);
    }
    this.switchTurns();
    this.findActivePlayer(actionObj);
    return messages;
  }
}
// class method used to generate a game, for testing.
Game.generateGame = (playerObj1, playerObj2) => {
  return Promise.all([
    generatePlayer(playerObj1.id, playerObj1.team),
    generatePlayer(playerObj2.id, playerObj2.team)
  ]).then(players => {
    return new Game(players);
  });
};

module.exports = Game;
