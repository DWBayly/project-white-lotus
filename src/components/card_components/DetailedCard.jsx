import React, {Component} from 'react';
import cardImageHeader from './cardImageHeader.jsx';
import cardInfo from './cardInfo.jsx';

class DetailedCard extends Component {
  constructor(props) {
    super(props);
  }
  attackDetails(monster){
    const attacks = [];
    for(const attackName in monster.attacks){
      const attack = monster.attacks[attackName];
      if(attack.isAlt){
        attacks.push(
          <div class="abilities-ability">
            <strong className="abilities-name"><span className="sword-ico">{attackName.replace('_', ' ')}</span></strong>
            <p>{attack.description}</p>
          </div>
        );
      } else {
        attacks.push(
          <div className="abilities-ability">
            <strong className="abilities-name"><span className="sword-ico"></span>{attackName.replace('_', ' ')}</strong>
            <p>{attack.description}</p>
          </div>
        );
      }
    }
    return attacks;
  }
  abilityDetails({ability}){
    if(!ability) return;
    return(
      <div className="abilities-ability">
        <strong className="abilities-name"><span className="sword-ico"></span>{ability.name}</strong>
        <p>{ability.description}</p>
      </div>
    );
  }
  render() {
    const {monster} = this.props;
    return (
      <div className="card-full">
        <span class="card-hp">{monster.hp}</span>
        <span class="card-acc">{monster.accuracy_bonus || '+2'}</span>
        {cardImageHeader(monster)}
        <h3>{monster.name}</h3>
        <div className="card-details">
          <div className="card-details-abilities">
            {this.attackDetails(monster)}
            {this.abilityDetails(monster)}
          </div>
        </div>
      </div>
    );
  }
}

export default DetailedCard;
