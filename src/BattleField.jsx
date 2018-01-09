import React, {Component} from 'react';
// This will throw warning 'Route is defined but never used'
// but it's required for routing between monsters#index and monsters#show
import {BrowserRouter as Route} from 'react-router-dom';
import {toggleModalByIdButton} from './lib/element_effect_helpers';

const delayFunction = (ms, callback) => {
  return new Promise(() => {
    setTimeout(callback, ms);
  });
};

class BattleField extends Component {
  // Places monster images on the battlefield. Prefix is either "player" or "opponent" as a string.
  generateMonsterImages(player, prefix) {
    const {team, graveyard, activeMonster} = player;
    const monsters = [];
    // add benched monsters
    for (const monsterId in team) {
      const curMonster = team[monsterId];
      let className = 'monster';
      // if this monsters is the active monster, add the active class.
      if(activeMonster && monsterId === activeMonster.id) {
        className += ' active';
      }
      monsters.push(
        <div key={monsterId} id={`m-${monsterId}`} className={className} onClick={toggleModalByIdButton(`${curMonster.id}-modal`)}>
          <span className='monster-name'>{curMonster.name}</span>
          <span className='monster-hp'>HP:{curMonster.hp}</span>
          <img src={curMonster.image_url} alt={curMonster.name}/>
        </div>
      );
    }
    for(const monsterId in graveyard){
      const deadMonster = graveyard[monsterId];
      let className = 'monster dead';
      if(!deadMonster.animated){
        className += ' death-fade-out';
      }
      monsters.push(
        <div key={monsterId} id={`m-${monsterId}`} className={className}>
          <img src={deadMonster.image_url} alt={deadMonster.name}/>
        </div>
      );
    }
    return monsters;
  }
  render() {
    const {player, opponent} = this.props;
    return (<section className="battlefield-visual row">
      <div className="player-side">
        {this.generateMonsterImages(player, 'player')}
      </div>
      <div className="opponent-side">
        {this.generateMonsterImages(opponent, 'opponent')}
      </div>
    </section>);
  }
}

export default BattleField;
