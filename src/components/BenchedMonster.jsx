import React, { Component } from 'react';
import cardImageHeader from './card_components/cardImageHeader.jsx';
import {toggleModalByIdButton} from '../lib/element_effect_helpers';

class BenchedMonster extends Component {
  render() {
    const {monster} = this.props;
    const {player} = this.props;
    let canBench = true;
    if(player.activeMonster) canBench = player.activeMonster.canBench;
    return (
      <section key={monster.id} className='bench-monster-container'>
        {this.props.isPlayer && <button data-id={monster.id} disabled={!player.turn || !canBench} onClick={this.props.unBench}>Activate</button>}
        <h4>{monster.name}</h4>
        <div data-id={monster.id} disabled={!this.props.player.turn} className="bench-monster">
          {cardImageHeader(monster, toggleModalByIdButton(`${monster.id}-modal`))}
          <span className="card-hp">{monster.hp}</span>
          <span className="card-acc">{monster.accuracy_bonus}</span>
        </div>
        {this.props.printModifier(monster)}
      </section>
    );
  }
}

export default BenchedMonster;
