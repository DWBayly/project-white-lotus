import React, {Component} from 'react';
import CardModal from './components/CardModal.jsx';

class Store extends Component {
  componentDidMount() {
    this.props.loadApp();
  }

  render() {
    return (<div className="store">
      <h2>Store</h2>
      <div className="store-items">
        <div className="store-item egg">
          <div className="store-item-details">
            <h4>Kaiju Egg</h4>
            <img src="assets/images/kaiju-egg.png" alt="Kaiju Egg"/>
            <p className="price">Cost:&#3647;50</p>
          </div>
          <button onClick={this.props.purchaseEgg}>Purchase</button>
        </div>
        <div className="store-item crate">
          <div className="store-item-details">
            <h4>Mech Crate</h4>
            <img src="assets/images/mecha-box.png" alt="Mecha Box"/>
            <p className="price">Cost:&#3647;50</p>
          </div>
          <button onClick={this.props.purchaseCrate}>Purchase</button>
        </div>
      </div>
      <p>You have &#3647;{this.props.brouzoff}</p>
      {this.props.purchasedMonster && <CardModal id={this.props.purchasedMonster.id} monster={this.props.purchasedMonster}/>}
    </div>);
  }
};

export default Store;
