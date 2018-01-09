import React, { Component } from 'react';

// Header should be the title
// main should be the main content
// Footer should be links out

class Modal extends Component {
  render() {
    return (
      <section id={this.props.id || ''} className="modal hidden">
        <div className='modal-container'>
          <header className="modal-header">
            <h3>{this.props.header}</h3>
          </header>
          <main className="modal-main">
            {this.props.mainContent}
          </main>
          <footer className="modal-footer">
            {this.props.footer}
          </footer>
        </div>
      </section>
    );
  }
}

export default Modal;
