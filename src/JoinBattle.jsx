import React, { Component } from 'react';
import {toggleElementById} from './lib/element_effect_helpers';
class CreateBattle extends Component {
  constructor(props) {
    super(props);
    this.state = {roomLink: null};
  }
  componentDidMount(){
    this.props.loadApp();
    this.findRoom = this.findRoom.bind(this);
  }
  findRoom(event){
    event.preventDefault();
    const form = event.target;
    const roomName = form.elements.roomName.value;
    if(roomName.length === 0){
      return;
    }
    this.setState({roomLink: roomName});
    toggleElementById('roomLink');
  }
  render() {
    return (
      <main>
        <h2>Join a Battle</h2>
        <form onSubmit={this.findRoom}>
          <label>Room name</label>
          <input name="roomName" type="text"></input>
          <button>Find Battle</button>
          <button id="roomLink" className='hidden'><a href={`battle/${this.state.roomLink}`}>Join Battle</a></button>
        </form>
      </main>
    );
  }
}

export default CreateBattle;
