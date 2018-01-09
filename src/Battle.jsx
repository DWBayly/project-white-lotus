import React, {Component} from 'react';
import {BrowserRouter as Route, Link} from 'react-router-dom';
import uuid from 'uuid';
import MessageBox from './components/MessageBox.jsx';
import CardModal from './components/CardModal.jsx';
import Modal from './components/Modal.jsx';
import BattleField from './BattleField.jsx';
import Player from './components/Player.jsx';
import {joinGame, rejoinBattle} from './lib/websocket.js';
import editBrouzoff from './lib/editBrouzoff.js';
import DetailedCard from './components/card_components/DetailedCard.jsx';
import {toggleModalById} from './lib/element_effect_helpers';

class Battle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      game: {},
      messages: [],
      player: {},
      opponent: {}
    };
    this.joinGame = this.joinGame.bind(this);
    this.renderTeam = this.renderTeam.bind(this);
  }
  showBattleScreen(){
    document.querySelector('.battlefield-teams').remove();
    document.querySelector('nav').remove();
    document.querySelector('#battlefield').classList.remove('hidden');
  }
  componentDidMount(){
    const {cookies, roomName} = this.props;
    this.props.fetchTeams();
    // check if the room exists by making a get request then trying to parse the response as JSON
    // If the room exists, it will receive a json response. If it doesn't exists then it will set state roomNotFound to true.
    fetch(`/battles/${roomName}`).then(res => {
      res.json().then(() => {

      }).catch(() => {
        this.setState({roomNotFound: true});
      });
    });
    // If there is a battlerId associated with this room in the cookies, attempt to rejoin
    const battlerId = cookies.get(decodeURI(this.props.roomName));
    if(battlerId){
      this.setState({battlerId});
      this.socket = rejoinBattle(this);
      this.setState({ready:true});
      this.showBattleScreen();
    }
  }
  // Handles sending join game requests.
  joinGame(event){
    const {cookies} = this.props;
    const battlerId = uuid();
    this.setState({battlerId});
    // decodeURI to get the original name
    cookies.set(decodeURI(this.props.roomName), battlerId);
    const team = [];
    const monsterContainer = event.currentTarget.nextSibling;
    for(const child of monsterContainer.children){
      if(!child.dataset.id) continue;
      team.push(child.dataset.id);
    }
    this.socket = joinGame(this, team.join(','));
    this.setState({ready:true});
    this.showBattleScreen();
  }
  gameOver() {
    const {gameOver} = this.state.game;
    if(gameOver){
      toggleModalById('gameOverModal');
      let earnings = 0;
      if(gameOver.winner.id === this.state.battlerId){
        earnings = 50;
        editBrouzoff(this.state.game, earnings);
      }
      editBrouzoff(this.state.game, earnings);
      return(
        <section>
          <h3>Winner is {gameOver.winner.name}!</h3>
          <img src='/assets/images/gold.png' alt='Gold rabbit'/>
          <h4>You've earned: &#3647;{earnings}</h4>
        </section>
      );
    }
  }
  renderTeam(team){
    const getTeamMembers = (teamMember) => {
      return (<DetailedCard className='card-full' monster={teamMember} />);
    };
    return (
      <article key={team.id} data-id={team.id} className='team'>
        <h3>{team.name}</h3>
        <button className="delete-team-button" onClick={this.joinGame}>Select Team</button>
        <section className="team-team-members">
          {team.teamMembers.map(getTeamMembers)}
        </section>
      </article>
    );
  }

  generateModals({players}){
    const modals = [];
    players.forEach(player => {
      const {team} = player;
      for (let monsterId in team) {
        const monster = team[monsterId];
        modals.push(<CardModal id={`${monster.id}-modal`} monster={monster}/>);
      }
    });
    return modals;
  }
  render() {
    if(this.state.roomNotFound){
      return(
        <main>
          <div>
            <h2>Room not found</h2>
            <Link to="/create-battle"><button>Create Battle</button></Link>
            <Link to="/join-battle"><button>Join Battle</button></Link>
          </div>
        </main>
      );
    }
    return (
      <main>
        <div className="battlefield-teams">
          {this.props.teams && this.props.teams.map(this.renderTeam)}
        </div>
        <div id="battlefield" className='hidden'>
          {this.state.game.players && <BattleField player={this.state.player} opponent={this.state.opponent} battlerId={this.state.battlerId} /> }
          {this.state.ready && <MessageBox className='messages row' messages={this.state.messages} />}
          {this.state.ready && <Player className='player row' player={this.state.player} socket={this.socket} curUserId={this.state.id} />}
          {this.state.ready && <section><span><a className='nav-link leave-game' href="/">Leave Game</a></span></section>}
        </div>
        <Modal id="gameOverModal" header="Game Over" mainContent={this.gameOver()} footer={<a className="button" href="/">Done</a>} />
        {this.state.game.players && this.generateModals(this.state.game)}
      </main>
    );
  }
}

export default Battle;
