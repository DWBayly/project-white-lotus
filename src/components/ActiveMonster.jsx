import React, { Component } from 'react';
// cardImageHeader is the background photo
import cardImageHeader from './card_components/cardImageHeader.jsx';
import {toggleModalByIdButton} from '../lib/element_effect_helpers';

class ActiveMonster extends Component {
  render() {
    const {monster} = this.props;
    return (
      <div class="battlefield-active-battler" id={monster.id}>
        <span class="card-hp">{monster.hp}</span>
        <span class="card-acc">{monster.accuracy_bonus}</span>
        <div class="active-monster-stats">
          {cardImageHeader(monster, toggleModalByIdButton(`${monster.id}-modal`))}
        </div>
      </div>
    );
  }
}

export default ActiveMonster;
