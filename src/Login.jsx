import React, { Component } from 'react';
import FlashMessage from './components/FlashMessage.jsx';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {register:false};
    this.toggle = this.toggle.bind(this);
  }
  toggle(event){
    if(this.state.register){
      this.setState({register:false});
    } else {
      this.setState({register:true});
    }
  }
  render() {
    if(this.state.register){
      return (
        <main className='login-panel'>
          <div>
            <h1>Mechas and Kaijus</h1>
            <h4>Register</h4>
            <FlashMessage message={this.props.flashMessage}/>
            <form id="registerForm">
              <label>Username</label>
              <input id='username' type='text'/>
              <label>Password</label>
              <input id='password' type='password' />
              <button onClick={this.props.register}>Submit</button>
            </form>
            <p>Or</p>
            <button onClick={this.toggle}>Login</button>
          </div>
        </main>);
    }
    return (
      <main className='login-panel'>
        <h1>Mechas and Kaijus</h1>
        <h4>Login</h4>
        <FlashMessage message={this.props.flashMessage}/>
        <form id="loginForm">
          <label>Username</label>
          <input id='username' type='text'/>
          <label>Password</label>
          <input id='password' type='password' />
          <button onClick={this.props.login}>Submit</button>
        </form>
        <p>Or</p>
        <button onClick={this.toggle}>Sign Up</button>
      </main>);
  }
}


export default Login;
