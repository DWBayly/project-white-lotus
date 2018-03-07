import React, {Component} from 'react';
import AddTeamPane from './components/AddTeamPane.jsx';
import DetailedCard from './components/card_components/DetailedCard.jsx';
import {toggleElementById} from './lib/element_effect_helpers.js';

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamCreation: false
    };
    this.sendTeam = this.sendTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
    this.toggleTeamPane = this.toggleTeamPane.bind(this);
  }
  componentDidMount() {
    this.props.setActiveLink(this.props.linkId);
    this.props.fetchMonsters();
    this.props.fetchTeams();
  }
  sendTeam(event) {
    event.preventDefault();
    event.stopPropagation();
    const teamList = document.querySelector('.addTeamPane-new-team');
    const name = document.querySelector('#teamNameForm').elements['teamName'].value;
    if (name.length < 1) {
      return;
    }
    if (teamList.childNodes.length < 3) {
      return;
    }

    // grabs monster ids from the cards in .addTeamPane-new-team
    const members = [];
    for (let monsterCard of teamList.childNodes) {
      members.push(monsterCard.getAttribute('data-id'));
    }
    fetch('/user/teams', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({name, members})
    }).then(() => {
      // reloads page
      window.location.href = '/teams';
    });
  }
  deleteTeam(event) {
    const teamId = event.target.parentNode.dataset.id;
    const body = {
      teamId
    };
    fetch('/user/teams', {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => {
      response.json().then(() => {
        this.props.fetchTeams();
      });
    });
  }

  /**
   * printTeams - shows all teams associated with the current logged in user.
   *
   */
  printTeams() {
    if (this.props.teams) {
      const {teams} = this.props;
      const getTeamMembers = (teamMember) => {
        return (<DetailedCard className='card-full' monster={teamMember} key={teamMember.id}/>);
      };
      return teams.map(team => {
        return (<article key={team.id} data-id={team.id} className='team'>
          <h3>{team.name}</h3>
          <button className="delete-team-button" onClick={this.deleteTeam}>Delete Team</button>
          <section className="team-team-members">
            {team.teamMembers.map(getTeamMembers)}
          </section>
        </article>);
      });
    }
  }

  /**
   * toggleTeamPane - toggles the panel from which a new team can be created.
   *
   * @param  {object} event - the click event object.
   */
  toggleTeamPane() {
    const changeButton = () => {
      const button = document.querySelector('.add-a-team');
      if(!button){
        return;
      }
      button.innerText === 'Close'
        ? button.innerText = 'Add a Team'
        : button.innerText = 'Close';
    };
    if(this.state.teamCreation){
      this.setState({teamCreation:false, changeButton});
    } else {
      this.setState({teamCreation:true, changeButton});
    }
  }
  render() {
    const {teams} = this.props;
    return (<section className="teams-list">
      <h2>Teams</h2>
      {((teams && teams.length > 0) || this.state.teamCreation) && <button className="add-a-team" onClick={this.toggleTeamPane}>Add a Team</button>}
      {this.state.teamCreation && <AddTeamPane sendTeam={this.sendTeam} monsters={this.props.monsters}/>}
      {!this.state.teamCreation && <section id="your-teams">
        <h3>Your Teams</h3>
        {(teams && teams.length === 0) && <p>You don't have any teams. <button onClick={this.toggleTeamPane}>Let's make one</button></p>}
        {teams && this.printTeams()}
      </section>}
    </section>);
  }
}

export default Teams;
