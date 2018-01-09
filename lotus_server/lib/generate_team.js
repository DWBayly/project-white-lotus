const getCreature = require('./generate_monster');

class Team{
  constructor(team){
    for(const monster of team){
      this[monster.id] = monster;
    }
  }
  // returns number of alive monsters
  aliveMonsters(){
    const monsters = [];
    for(const monstId in this){
      const monster = this[monstId];
      monsters.push(monster);
    }
    return monsters;
  }
}

const generateTeam = (team, userid) => {
  const teamMembers = [];
  // spin up the promises
  team.forEach(creature => {
    teamMembers.push(getCreature(creature, userid));
  });
  // Once all the teamMembers are pulled.
  return Promise.all(teamMembers).then(teamMembers => {
    return new Team(teamMembers, userid);
  });
};

module.exports = generateTeam;
