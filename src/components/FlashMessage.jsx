import React, { Component } from 'react';

class FlashMessage extends Component {
  render() {
    return (
      <section className="flash-message">{this.props.message}</section>
    );
  }
}

export default FlashMessage;
