import React, { Component } from 'react';
import {toggleModalByIdButton} from '../lib/element_effect_helpers';
import DetailedCard from './card_components/DetailedCard.jsx';

// Header should be the title
// main should be the main content
// Footer should be links out

class Modal extends Component {
  render() {
    return (
      <section id={this.props.id || ''} className="modal hidden" onClick={toggleModalByIdButton(this.props.id)}>
        <div className='card-modal-container'>
          <main>
            <DetailedCard className='card-full card-modal' monster={this.props.monster} />
            <div className='close-modal'>
              <button>Close</button>
            </div>
          </main>
        </div>
      </section>
    );
  }
}

export default Modal;
