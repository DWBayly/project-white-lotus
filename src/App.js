import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {instanceOf} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';

// Components
import Battle from './Battle.jsx';
import Monsters from './Monsters.jsx';
import Store from './Store.jsx';
import Login from './Login.jsx';
import Teams from './Teams.jsx';
import CreateBattle from './CreateBattle.jsx';
import JoinBattle from './JoinBattle.jsx';
import {toggleModalById} from './lib/element_effect_helpers';

// Functions
import {postLogin, fetchUserDetails, postRegister, setLoggedIn} from './lib/user_auth.js';
import {postNewMonster} from './lib/store.js';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.purchaseEgg = this.purchaseEgg.bind(this);
    this.purchaseCrate = this.purchaseCrate.bind(this);
    this.fetchMonsters = this.fetchMonsters.bind(this);
    this.fetchTeams = this.fetchTeams.bind(this);
    this.loadApp = this.loadApp.bind(this);
    this.state = {
      id: '',
      loggedin: false,
      loaded: false,
      monsters: [],
      teams: null,
      flashMessage: null
    };
  }

  componentWillMount() {
    const {cookies} = this.props;
    if (cookies.get('loggedin')) {
      this.setState({
        loggedin: cookies.get('loggedin')
      }, () => {
        fetchUserDetails(this);
      });
    }
  }

  register(event) {
    event.preventDefault();
    postRegister(event).then(res => {
      res.json().then(resObj => {
        if (resObj.error) {
          this.setState({flashMessage: resObj.error});
          return;
        }
        setLoggedIn(this);
      });
    });
  }

  login(event) {
    event.preventDefault();
    postLogin(event).then(res => {
      res.json().then(resObj => {
        if (resObj.error) {
          this.setState({flashMessage: resObj.error})
          return;
        }
        this.setState({flashMessage: null})
        setLoggedIn(this);
      });
    });
  }

  logout(event) {
    const {cookies} = this.props;
    cookies.remove('loggedin');
    this.setState({
      id: null,
      loggedin: cookies.get('loggedin'),
      brouzoff: null
    });
    fetch('/logout', {
      credentials: 'same-origin',
      method: 'DELETE'
    });
  }

  loadApp() {
    this.setState({loaded: true});
  }

  fetchMonsters() {
    fetch('/monsters', {credentials: 'same-origin'}).then(res => {
      res.json().then(data => {
        this.setState({monsters: data});
        this.loadApp();
      });
    });
  }

  fetchTeams() {
    fetch('/user/teams', {credentials: 'same-origin'}).then(data => {
      data.json().then(parsedData => {
        this.setState({teams: parsedData.teams});
        this.loadApp();
      });
    });
  }

  fetchNewMonster(creature) {
    postNewMonster(creature).then(res => {
      res.json().then(data => {
        this.setState({brouzoff: data.brouzoff, purchasedMonster: data.monster});
        toggleModalById(data.monster.id);
      });
    });
  }

  purchaseEgg(event) {
    event.preventDefault();
    this.fetchNewMonster('kaiju');
  }

  purchaseCrate(event) {
    event.preventDefault();
    this.fetchNewMonster('mecha');
  }

  render() {
    const {username} = this.state;
    if (this.state.loggedin) {
      return (<Router>
        <div className="container" hidden={!this.state.loaded}>
          <nav>
            <section className="nav-links">
              <span><Link className='nav-link' to="/create-battle">Create Battle</Link></span>
              <span><Link className='nav-link' to="/join-battle">Join Battle</Link></span>
              <span><Link className='nav-link' to="/teams">Teams</Link></span>
              <span><Link className='nav-link' to="/">Monsters</Link></span>
              <span><Link className='nav-link' to="/store">Store</Link></span>
            </section>
            <section className="nav-user">
              <p>Hi, {username}</p>
              <Link to="/">
                <button onClick={this.logout} className='button button-outline'>Log out</button>
              </Link>
            </section>
          </nav>
          <Route exact path="/" render={() =>
            (<Monsters fetchMonsters={this.fetchMonsters} monsters={this.state.monsters} loaded={this.state.loaded} />)
          }/>
          <Route path="/store" render={(props) =>
            (<Store {...props} brouzoff={this.state.brouzoff} loadApp={this.loadApp} purchasedMonster={this.state.purchasedMonster} purchaseEgg={this.purchaseEgg} purchaseCrate={this.purchaseCrate}/>)
          }/>
          <Route path="/teams" render={() =>
            (<Teams fetchMonsters={this.fetchMonsters} fetchTeams={this.fetchTeams} teams={this.state.teams} monsters={this.state.monsters}/>)
          }/>
          <Route path="/battle/:roomName" render={({match}) => (
            <Battle cookies={this.props.cookies} roomName={match.params.roomName} username={username} teams={this.state.teams} fetchTeams={this.fetchTeams}/>)
          }/>
          <Route path="/create-battle" render={() =>
            (<CreateBattle loadApp={this.loadApp} />)
          }/>
        <Route path="/join-battle" render={() =>
            (<JoinBattle loadApp={this.loadApp} />)
          }/>
        </div>
      </Router>);
    } else {
      return(
        <Login
          state = {this.state}
          login = {this.login}
          register = {this.register}
          hidden = {this.state.loggedin}
          flashMessage = {this.state.flashMessage}
        />);
    }
  }
}
export default withCookies(App);
