import React, { Component } from 'react';
import {toggleElementById} from './lib/element_effect_helpers';
class CreateBattle extends Component {
  constructor(props) {
    super(props);
    this.state = {roomLink: null};
  }
  componentDidMount(){
    this.props.loadApp();
    this.submitRoom = this.submitRoom.bind(this);
  }
  submitRoom(event){
    event.preventDefault();
    const form = event.target;
    const roomName = form.elements.roomName.value;
    if(roomName.length === 0){
      return;
    }
    fetch('/battles', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'content-type' : 'application/json'
      },
      body: JSON.stringify({roomName: encodeURI(roomName)})
    }).then(data => data.json().then(res => {
      this.setState({roomLink: res.flash});
      toggleElementById('roomLink');
    }));
  }
  render() {
    return (
      <main>
        <h2>Start a Battle</h2>
        <p id="roomLink" className='hidden'>Your battlefield: <a href={this.state.roomLink}>{this.state.roomLink}</a></p>
        <form onSubmit={this.submitRoom}>
          <label>Room name</label>
          <input name="roomName" type="text"></input>
          <button>Start a battle</button>
        </form>
      </main>
    );
  }
}

export default CreateBattle;
