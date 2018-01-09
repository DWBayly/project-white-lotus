import React, {Component} from 'react';
import cardImageHeader from './cardImageHeader.jsx';

class DetailedCard extends Component {
  attackDetails(monster){
    const attacks = [];
    let attackKey = 1;
    let abilityKey = -1;
    for(const attackName in monster.attacks){
      const attack = monster.attacks[attackName];
      if(attack.isAlt){
        attacks.push(
          <div className="abilities-ability" key={attackKey}>
            <strong className="abilities-name"><span className="sword-ico">ATK: {attackName.replace('_', ' ')}</span></strong>
            <p>{attack.description}</p>
          </div>
        );
        attackKey++;
      } else {
        attacks.push(
          <div className="abilities-ability" key={abilityKey}>
            <strong className="abilities-name"><span className="sword-ico"></span>ATK: {attackName.replace('_', ' ')}</strong>
            <p>{attack.description}</p>
          </div>
        );
        abilityKey--;
      }
    }
    return attacks;
  }
  abilityDetails({ability}){
    if(!ability) return;
    return(
      <div className="abilities-ability">
        <strong className="abilities-name"><span className="sword-ico"></span>ABL: {ability.name.replace('_', ' ')}</strong>
        <p>{ability.description}</p>
      </div>
    );
  }
  // send a fetch request to delete a monster.
  deleteMonster(event){
    const monsterCard = event.currentTarget.parentNode;
    const id = monsterCard.dataset.id;
    fetch(`/monsters/${id}`, {
      credentials: 'same-origin',
      method:'DELETE'
    }).then(() => {
      window.location.href = '/';
    });
  }
  render() {
    const {monster} = this.props;
    return (
      <div key={monster.id} className={this.props.className} data-id={monster.id}>
        <span class="card-hp">{monster.hp}</span>
        <span class="card-acc">{monster.accuracy_bonus}</span>
        {cardImageHeader(monster)}
        <h3>{monster.name}</h3>
        <div className="card-details">
          <div className="stats">
            <p><strong>Type:</strong> {monster.type.name}</p>
            <p><strong>Creature:</strong> {monster.creature}</p>
          </div>
          <div className="card-details-abilities">
            {this.attackDetails(monster)}
            {this.abilityDetails(monster)}
          </div>
        </div>
        {this.props.deletable && <button className="delete-monster-button button button-outline" onClick={this.deleteMonster}>Delete</button>}
      </div>
    );
  }
}

export default DetailedCard;
