import React, {Component} from 'react';
import DetailedCard from './card_components/DetailedCard.jsx';
import {toggleHiddenElements} from '../lib/element_effect_helpers.js';

class AddTeamPane extends Component {
  constructor(props) {
    super(props);
    this.state = {readyToSend:false};
    this.addCreatureToTeam = this.addCreatureToTeam.bind(this);
    this.removeCreatureFromTeam = this.removeCreatureFromTeam.bind(this);
  }
  createButton(className){
    const newButton = document.createElement('button');
    newButton.classList.add(className);
    if(className === 'remove'){
      newButton.addEventListener('click', this.removeCreatureFromTeam);
      newButton.innerText = 'Remove from Team';
    } else {
      newButton.addEventListener('click', this.addCreatureToTeam);
      newButton.innerText = 'Add to Team';
    }
    return newButton;
  }
  addCreatureToTeam(event) {
    event.stopPropagation();
    const teamList = document.querySelector('.addTeamPane-new-team');
    const monsterCard = event.target.parentNode;
    const button = event.currentTarget;
    const newButton = this.createButton('remove');
    if (teamList.childNodes.length === 3) {
      return;
    }
    monsterCard.removeChild(button);
    monsterCard.append(newButton);
    teamList.appendChild(monsterCard);
    if (teamList.childNodes.length === 3) {
      this.setState({readyToSend: true});
    } else {
      this.setState({readyToSend: false});
    }
  }
  removeCreatureFromTeam(event){
    const evt = event;
    const button = evt.currentTarget;
    const newButton = this.createButton('add');
    // event.stopPropagation();
    this.setState({readyToSend:false}, () => {
      const monsterList = document.querySelector('.addTeamPane-container');
      const monsterCard = button.parentElement;
      monsterCard.removeChild(button);
      monsterCard.append(newButton);
      monsterList.prepend(monsterCard);
    });
  }
  showMonsters(){
    const {monsters} = this.props;
    if(monsters.length === 0){
      return (<p>You don't have any monsters. <a href='/store/'>Visit the store</a> to buy some.</p>);
    }
    return monsters.map(monster => {
      return (
        <section key={monster.id} data-id={monster.id} className="monster-card">
          <DetailedCard className='card-full' monster={monster} />
          <button className='add' onClick={this.addCreatureToTeam}>Add to Team</button>
        </section>
      );
    });
  }
  render() {
    return (
      <section id="addTeamPane" className='add-team'>
        <h3>Create a New Team</h3>
        {!this.state.readyToSend && <p>Select 3 monsters to create a team</p>}
        <section className='addTeamPane-new-team'></section>
        {this.state.readyToSend &&
          <form id="teamNameForm" onSubmit={this.props.sendTeam}>
            <h4>Enter a Team Name</h4>
            <input type="text" name="teamName" placeholder="Team name" />
          </form>}
        {this.state.readyToSend && <button form="teamNameForm">Submit team</button>}
        {!this.state.readyToSend && <hr/>}
        {!this.state.readyToSend && <div className='addTeamPane-container'>{this.showMonsters()}</div>}
      </section>
    );
  }
}

export default AddTeamPane;
