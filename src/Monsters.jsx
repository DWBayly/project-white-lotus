import React, { Component } from 'react';
// This will throw warning 'Route is defined but never used'
// but it's required for routing between monsters#index and monsters#show
import { BrowserRouter as Route, Link } from 'react-router-dom';
import MonsterInfo from './components/MonsterInfo';
import DetailedCard from './components/card_components/DetailedCard.jsx';
class Monsters extends Component {
  constructor(props) {
    super(props);
  }

  printMonsters() {
    const monsters = this.props.monsters;
    const monsterArray = [];
    for(let monster of monsters){
      monsterArray.push(
        <DetailedCard monster={monster} />
      );
    }
    return monsterArray;
  }

  componentDidMount(){
    this.props.fetchMonsters();
  }

  render() {
    if (this.props.monsters.length > 0) {
      return (
        <main>
          <h2>Monsters</h2>
          <div className='monster-container'>
            {this.printMonsters()}
          </div>
        </main>
      );
    } else {
      return (
        <main>
          <h2>Monsters</h2>
          <p>You don't have any monsters yet!</p>
          <Link to='/store'>Store</Link>
        </main>
      );
    }
  }
}

export default Monsters;
