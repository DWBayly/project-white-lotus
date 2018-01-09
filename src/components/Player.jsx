import React, { Component } from 'react';
import ActiveMonster from './ActiveMonster.jsx';
import BenchedMonster from './BenchedMonster.jsx';

class Player extends Component {
  constructor(props) {
    super(props);
    this.sendAttack = this.sendAttack.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.unBench = this.unBench.bind(this);
  }
  unBench(event){
    let id = event.target.dataset.id;
    this.sendMessage({messageType: 'action', action: 'activate', monsterId: id});
  }
  sendMessage(message){
    this.props.socket.send(JSON.stringify(message));
  }
  sendAttack(event){
    const attackName = event.target.getAttribute('data-name');
    this.sendMessage({messageType: 'action', action: 'attack', 'name': attackName, options: null});
  }
  generateActiveMonster(){
    const {player} = this.props;
    if(!player.team) return (<p>Waiting for other player.</p>);

    if(player.activeMonster){
      const monster = player.activeMonster;
      return (
        <section className='activemonster-container'>
          <h4>{monster.name}</h4>
          <ActiveMonster key={monster.id} isPlayer={true} player={player} monster={monster} sendAttack={this.sendAttack} />
          {this.printModifier(monster)}
        </section>
      );
    }
  }
  printAttacks(){
    const monster = this.props.player.activeMonster;
    if(!monster) return;
    const attacks = [];
    for(let attackName in monster.attacks){
      const attack = monster.attacks[attackName];
      attacks.push(<button className='button' disabled={!this.props.player.turn} key={attack.id} onClick={this.sendAttack} data-name={attack.name}>{attack.name.replace('_', ' ')}</button>);
    }
    return (
      <section className="abilities-actions">
        {attacks}
      </section>
    );
  }
  generateBenchedMonster(){
    let cards = [];
    const {player} = this.props;
    if(!player.team) return;
    for(const monsterid in player.team){
      const monster = player.team[monsterid];
      if(monster.killed){
        continue;
      }
      if(monster.bench){
        cards.push(
          <BenchedMonster key={monster.id} isPlayer={true} player={player} printModifier={this.printModifier} monster={monster} unBench={this.unBench} />
        );
      }
    }
    return cards;
  }
  printModifier(monster){
    const modifiers = [];
    for(const modifierId in monster.modifiers){
      const modifier = monster.modifiers[modifierId];
      let icon = `/assets/icons/${modifier.name}.png`;
      modifiers.push(<img src={icon} title={modifier.description} alt={modifier.name}/>);
    }
    return(
      <section className='modifiers'>
        {modifiers}
      </section>
    );
  }
  render() {
    /**
     * <section className='modifiers'>
       {player.activeMonster && <h4>Modifiers</h4>}
       {player.activeMonster && this.showModifiers()}
     </section>
     */
    const {player} = this.props;
    return (
      <section className={this.props.className}>
        <div className="battlefield-active column column-60">
          <h4>Active Monster</h4>
          <section className="battle-info">
            {this.generateActiveMonster()}
            <section className="abilities">
              {player.activeMonster && <h4>Actions</h4>}
              {this.printAttacks()}
            </section>
          </section>
        </div>
        <div className="battlefield-bench column-40">
          <h4>Benched Monsters</h4>
          <div className="battlefield-benched">
            {this.generateBenchedMonster()}
          </div>
        </div>
      </section>
    );
  }
}

export default Player;
