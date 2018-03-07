import React, { Component } from 'react';
import {toggleElementById} from './lib/element_effect_helpers';
class CreateBattle extends Component {
  constructor(props) {
    super(props);
    this.state = {roomLink: null};
  }
  componentDidMount(){
    this.props.setActiveLink(this.props.linkId);
    this.props.loadApp();
    this.findRoom = this.findRoom.bind(this);
  }
  findRoom(event){
    event.preventDefault();
    const form = event.target;
    const roomName = encodeURI(form.elements.roomName.value);
    if(roomName.length === 0){
      this.props.showFlashMessage('Room name must be given.');
      return;
    }
    fetch(`/battles/${roomName}/exists`).then(res => {
      res.json().then(res => {
        console.log(res);
        window.location.href = `/battles/${roomName}`;
      }).catch(() => {
        this.props.showFlashMessage(<span>Sorry, this room does not exist. <a href="/create-battle">Create it!</a></span>);
      });
    });
  }
  render() {
    return (
      <main>
        <h2>Join a Battle</h2>
        <form onSubmit={this.findRoom}>
          <label>Room name</label>
          <input name="roomName" type="text"></input>
          <button>Find Battle</button>
        </form>
      </main>
    );
  }
}

export default CreateBattle;
