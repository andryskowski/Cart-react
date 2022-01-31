import React, { useState } from 'react';
import './sass/styles.scss';
import productImage from './assets/img/product-image.png';
import Data from './Data.json';

function App() {
  const [items, setItems] = useState(Data.items);

  const removeItem = (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
  };

  const setQuantity = (currentItem, amount) => {
    if((amount === 1 && currentItem.qty <  10) || (amount === -1 && currentItem.qty > 1)) {
    setItems(items.map(item => item.id === currentItem.id ? {
      ...item,
      qty: item.qty + amount
    } : item));
    }
  };

  const getOrderTotal = () => {
    const orderTotal = items.map((item) => item.price.current_price * item.qty).reduce((x,y) => x+y, 0);
    const orderPlusShipping = (orderTotal + Data.shipping).toFixed(2);
    return orderPlusShipping;
  };

  const item = items.map((item) => {
    return (<li id={item.id}>
      <div className="product-info">
        <div className="product-img-container">
          <img className="product-img" src={productImage} alt="no img"></img>
        </div>
        <div className="product-info-text">
        <h2 className="product-name">{item.product_name ? item.product_name : ''}</h2>
         {item.product_options.map(option => { if(option.id === 'size') return <p className="product-size"><b>Size: {option.value}</b></p>})}
         {item.product_options.map(option => { if(option.id === 'color') return <p className="product-color"><b>Color: {option.value}</b></p>})}
         {item.product_options.map(option => { if(option.id === 'pattern') return <p className="product-pattern"><b>Pattern: {option.value}</b></p>})}
        </div>
        <div className="button-container">
          <button className="button-x" onClick={() => removeItem(item.id)}>X</button>
      </div>
      </div>
      <div className="product-summary">
        <div className="quantity-counter-container">
        <p><b>Qty:</b></p>
        <div className="quantity-counter-button">
          <div className="button-minus-container">
            <button className={item.qty === 1 ? "button-minus" : "button-minus active-btn"} onClick={() => setQuantity(item, -1)}>-</button>
          </div>
          <div className="qty-field-container">
          <span>{item.qty}</span>
          </div>
          <div className="button-plus-container">
            <button className={item.qty === 10 ? "button-plus" : "button-plus active-btn"} onClick={() => setQuantity(item, 1)}>+</button>
          </div>
        </div>
        </div>
        <div className="prices-container">
            <div className="old-price"><h2>{item.price.old_price ? `${Data.currency}` + item.price.old_price.toFixed(2) : ''}</h2></div>
            <div className="current-price"><h2>{item.price.current_price ? `${Data.currency}` + item.price.current_price.toFixed(2) : ''}</h2></div>
          </div>
      </div>
      </li>)
  });

  return (
    <div className="App">
      <div className="violet-square">
      </div>
     <div className="minicart">
       <div className="section section-header">
        <h2>Cart ({items.length})</h2>
        <div className="button-container">
          <button className="button-x">X</button>
        </div>
       </div>

       <div className="section section-list">
        <ul className="products-list">
          {item}
        </ul>
      </div>

      <div className="section section-summary">
        <div className="section-summary-text">
        <p className="shipping"><span>Shipping:</span> <span>{Data.shipping}{Data.currency}</span></p>
        <p className="order-total"><span>Order total:</span> <span>{Data.currency} {getOrderTotal()}</span></p>
        </div>
        <div className="button-container">
          <button className="button-checkout">Checkout</button>
        </div>
      </div>
     </div>
    </div>
  );
}

export default App;
