import React, { Component } from 'react';

class Player extends Component {
  constructor(props) {
    super(props);
    this.sendAttack = this.sendAttack.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.unBench = this.unBench.bind(this);
    this.state = {
      activeMonster: ''
    }
  }
  generateUserCards(){
    let cards = [];
    const {player} = this.props;
    if(!player.team) return (<p>Waiting for other player.</p>);
    for(const monsterid in player.team){
      const monster = player.team[monsterid];
      let action = <p></p>;
      if(player.turn){
        action = monster.bench ? <button className='button button-outline game-button' onClick={this.unBench} data-id={monster.id}>Unbench</button> : this.showAttacks(monster);
      }
      cards.push(
        <article key={monster.id} id={monster.id} data-active='false' className='user-card'>
          <h3>{monster.name}</h3>
          <p>{monster.hp}HP</p>
          {action}
        </article>
      );
    }
    return cards;
  }
  showAttacks(monster){
    const attacks = [];
    for(const attackName in monster.attacks){
      const attack = monster.attacks[attackName];
      const attackName = attack.name.replace('_', ' ');
      attacks.push(<button className='button button-outline game-button' key={attack.id} onClick={this.sendAttack} data-name={attack.name} title={attack.description}>{attackName}</button>);
    }
    return (
      <section className="Attacks">
        {attacks}
      </section>
    );
  }
  unBench(event){
    let id = event.target.getAttribute('data-id');
    this.sendMessage({messageType: 'action', action: 'activate', monsterId: id});
    let benched = this.state.activeMonster;
    if (this.state.activeMonster && document.getElementById(benched)) {
      document.getElementById(benched).dataset.active = 'false';
    }
    this.setState({activeMonster: id});
    document.getElementById(id).dataset.active = 'true';
  }
  sendMessage(message){
    this.props.socket.send(JSON.stringify(message));
  }
  sendAttack(event){
    const attackName = event.target.getAttribute('data-name');
    this.sendMessage({messageType: 'action', action: 'attack', 'name': attackName, options: null});
  }
  render() {
    return (
      <section className="player">
        {this.generateUserCards()}
      </section>
    );
  }
}

export default Player;
