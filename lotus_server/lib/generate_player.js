const generateTeam = require('./generate_team');
// Generate player function takes a userId to apply to the player and an array of 3 ids representing monsters
// to be on the player's team.
class Player {
  constructor(userid, team, name) {
    if(name) this.name = name;
    this.id = userid;
    this.team = team;
    this.graveyard = {};
    this.turn = false;
    this.activeMonster = undefined;
  }
  // checks if any monsters are dead.
  checkForDeath(){
    const {team, graveyard} = this;
    // turn the animated attribute of the graveyard to true
    for(const monstId in graveyard){
      const deadMonster = graveyard[monstId];
      deadMonster.animated = true;
    }
    for(const monstId in team){
      const monster = team[monstId];
      if(monster.hp < 1){
        this.graveyard[monstId] = monster;
        delete team[monstId];
        // If the monster that died is the active monster, the game will automatically set the next monster in the list as the active monster.
        const aliveMonsters = team.aliveMonsters();
        if(monster.bench === false && aliveMonsters.length > 0){
          const firstMonsterId = aliveMonsters[0].id;
          team[firstMonsterId].bench = false;
          this.findActiveMonster();
        }
        monster.bench = true;
        monster.passiveActive = false;
      }
    }
  }
  activateMonster(monsterId){
    const {team} = this;
    for(const monstId in team){
      const monster = team[monstId];
      monsterId === monstId ? monster.bench = false : monster.bench = true;
    }
    this.findActiveMonster();
    return [`${this.name || 'user'} has changed their active monster to ${this.activeMonster.name}`];
  }
  findActiveMonster(){
    for(const monsterId in this.team){
      const monster = this.team[monsterId];
      if(monster.bench === false){
        this.activeMonster = monster;
        continue;
      }
      // resets certain passive monster attributes when a new active monster is searched for.
      monster.passiveActive = true;
      monster.protector = null;
    }
  }
  // gets a random monster from the player's team. Can take a filter object e.g. {bench: true}.
  getRandomMonster(filterObject){
    let filteredTeam = null;
    // Build a filtered team if the filterObject is prevent.
    if(filterObject){
      filteredTeam = {};
      for(const monsterId in this.team){
        const monster = this.team[monsterId];
        let invalid = false;
        for(const attribute in filterObject){
          if(monster[attribute] !== filterObject[attribute]){
            invalid = true;
          }
        }
        if(invalid){
          continue;
        }
        filteredTeam[monster.id] = monster;
      }
    }
    const playerTeamIds = Object.keys(filteredTeam || this.team);
    const randomIndex = Math.floor(Math.random()*playerTeamIds.length);
    return this.team[playerTeamIds[randomIndex]];
  }
}
// Takes a userid (string) and a team, (array of strings)
const generatePlayer = (userid, team, name) => {
  return generateTeam(team, userid).then(team => {
    return new Player(userid, team, name);
  });
};

module.exports = generatePlayer;
