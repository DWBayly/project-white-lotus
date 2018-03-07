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
import FlashMessage from './components/FlashMessage.jsx';

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
    this.showFlashMessage = this.showFlashMessage.bind(this);
    this.setActiveLink = this.setActiveLink.bind(this);
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

  componentWillUpdate(){
    if(this.state.flashMessage){
      this.setState({flashMessage:null});
    }
  }

  showFlashMessage(message){
    this.setState({flashMessage:message});
  }
  register(event) {
    event.preventDefault();
    postRegister(event).then(res => {
      res.json().then(resObj => {
        if (resObj.error) {
          this.setState({flashMessage: resObj.error});
          return;
        }
        this.setState({flashMessage:null});
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
        console.log(parsedData.teams);
        this.setState({teams: parsedData.teams});
        this.loadApp();
      });
    });
  }

  fetchNewMonster(creature) {
    postNewMonster(creature).then(res => {
      res.json().then(data => {
        if(data.error){
          this.setState({flashMessage:data.error});
          return;
        }
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
  setActiveLink(linkId){
    const linkButton = document.querySelector(`#${linkId}`);
    const navLinks = linkButton.parentElement;
    for(const child of navLinks.children){
      if(child === linkButton){
        child.classList.add('on-page');
      } else {
        child.classList.remove('on-page');
      }
    }
  }

  render() {
    const {username} = this.state;
    const linkIds = ['create-battle-link', 'join-battle-link', 'teams-link', 'monsters-link', 'store-link'];
    if (this.state.loggedin) {
      return (<Router>
        <div className="container" hidden={!this.state.loaded}>
          <nav>
            <section className="nav-links">
              <Link id={linkIds[0]} className='nav-link' to="/create-battle">Create Battle</Link>
              <Link id={linkIds[1]} className='nav-link' to="/join-battle">Join Battle</Link>
              <Link id={linkIds[2]} className='nav-link' to="/teams">Teams</Link>
              <Link id={linkIds[3]} className='nav-link' to="/">Monsters</Link>
              <Link id={linkIds[4]} className='nav-link' to="/store">Store</Link>
            </section>
            <section className="nav-user">
              <p>Hi, {username}</p>
              <Link to="/">
                <button onClick={this.logout} className='button button-outline'>Log out</button>
              </Link>
            </section>
          </nav>
          <FlashMessage message={this.state.flashMessage}/>
          <Route path="/create-battle" render={() =>
            (<CreateBattle
              showFlashMessage={this.showFlashMessage}
              loadApp={this.loadApp}
              linkId={linkIds[0]}
              setActiveLink={this.setActiveLink}
            />)
          }/>
          <Route path="/join-battle" render={() =>
              (<JoinBattle
                showFlashMessage={this.showFlashMessage}
                loadApp={this.loadApp}
                linkId={linkIds[1]}
                setActiveLink={this.setActiveLink}
              />)
            }/>
            <Route path="/teams" render={() =>
              (<Teams
                showFlashMessage={this.showFlashMessage}
                fetchMonsters={this.fetchMonsters}
                fetchTeams={this.fetchTeams}
                teams={this.state.teams}
                monsters={this.state.monsters}
                setActiveLink={this.setActiveLink}
                linkId={linkIds[2]}
              />)
            }/>
          <Route exact path="/" render={() =>
            (<Monsters
              showFlashMessage={this.showFlashMessage}
              fetchMonsters={this.fetchMonsters}
              monsters={this.state.monsters}
              loaded={this.state.loaded}
              linkId={linkIds[3]}
              setActiveLink={this.setActiveLink}
              />)
            }/>
            <Route path="/store" render={(props) =>
              (<Store {...props}
                showFlashMessage={this.showFlashMessage}
                brouzoff={this.state.brouzoff}
                loadApp={this.loadApp}
                purchasedMonster={this.state.purchasedMonster}
                purchaseEgg={this.purchaseEgg}
                purchaseCrate={this.purchaseCrate}
                linkId={linkIds[4]}
                setActiveLink={this.setActiveLink}
                />)
            }/>
            <Route path="/battles/:roomName" render={({match}) => (
              <Battle showFlashMessage={this.showFlashMessage} cookies={this.props.cookies} roomName={match.params.roomName} username={username} teams={this.state.teams} fetchTeams={this.fetchTeams}/>)
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
