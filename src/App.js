import React, { useState, useEffect, useRef } from "react";
import "./sass/styles.scss";
import productImage from "./assets/img/product-image.png";
import Data from "./Data.json";

function App() {
  const [items, setItems] = useState(Data.items);
  const [recommendedProducts, setRecomendedProducts] = useState([]);
  const refDivToAnimation = useRef(null);

  useEffect(async () => {
    const response = await fetch("https://fakestoreapi.com/products?limit=2")
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error:", error);
      });
    setRecomendedProducts(response);
  }, []);

  const removeItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  // amount: -1 - button minus, 0 - own value, 1 - button plus
  const setQuantity = (currentItem, amount, event) => {
    const valueFromInput = Number(event.target.value);
    // setQuantity by buttons
    if (
      (amount === 1 && currentItem.qty < 10) ||
      (amount === -1 && currentItem.qty > 1)
    ) {
      setItems(
        items.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                qty: item.qty + amount,
              }
            : item
        )
      );
    }

    // setQuantity by input
    if (amount === 0 && valueFromInput <= 10 && valueFromInput >= 1) {
      setItems(
        items.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                qty: valueFromInput,
              }
            : item
        )
      );
    }
  };

  const getOrderTotal = () => {
    const orderTotal = items
      .map((item) => item.price.current_price * item.qty)
      .reduce((x, y) => x + y, 0);
    const orderPlusShipping = (orderTotal + Data.shipping).toFixed(2);
    return orderPlusShipping;
  };

  const listItems = items.map((item) => {
    return (
      <li id={item.id} key={item.id}>
        <div className="product-info">
          <div className="product-img-container">
            <img className="product-img" src={productImage} alt="no img"></img>
          </div>
          <div className="product-info-text">
            <h2 className="product-name">
              {item.product_name ? item.product_name : ""}
            </h2>
            {item.product_options.map((option) => {
              if (option.id === "size")
                return (
                  <p key={option.id} className="product-size">
                    <b>Size:</b> <span>{option.value}</span>
                  </p>
                );
            })}
            {item.product_options.map((option) => {
              if (option.id === "color")
                return (
                  <p key={option.id} className="product-color">
                    <b>Color:</b> <span>{option.value}</span>
                  </p>
                );
            })}
            {item.product_options.map((option) => {
              if (option.id === "pattern")
                return (
                  <p key={option.id} className="product-pattern">
                    <b>Pattern:</b> <span>{option.value}</span>
                  </p>
                );
            })}
          </div>
          <div className="button-container">
            <button className="button-x" onClick={() => removeItem(item.id)}>
              X
            </button>
          </div>
        </div>
        <div className="product-summary">
          <div className="quantity-counter-container">
            <p>
              <b>Qty:</b>
            </p>
            <div className="quantity-counter-button">
              <div className="button-minus-container">
                <button
                  className={
                    item.qty === 1 ? "button-minus" : "button-minus active-btn"
                  }
                  onClick={(e) => setQuantity(item, -1, e)}
                >
                  -
                </button>
              </div>
              <div className="qty-field-container">
                <input
                  value={item.qty}
                  onChange={(e) => setQuantity(item, 0, e)}
                  className="qty-field"
                ></input>
              </div>
              <div className="button-plus-container">
                <button
                  className={
                    item.qty === 10 ? "button-plus" : "button-plus active-btn"
                  }
                  onClick={(e) => setQuantity(item, 1, e)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="prices-container">
            <div className="old-price">
              <h2>
                {item.price.old_price
                  ? `${Data.currency}` + item.price.old_price.toFixed(2)
                  : ""}
              </h2>
            </div>
            <div className="current-price">
              <h2>
                {item.price.current_price
                  ? `${Data.currency}` + item.price.current_price.toFixed(2)
                  : ""}
              </h2>
            </div>
          </div>
        </div>
      </li>
    );
  });

  const listRecommended = recommendedProducts.map((item) => {
    return (
      <li className="recommended-product" key={item.id}>
        <div className="product-img-container">
          <img className="product-img" src={productImage} alt="no img"></img>
        </div>
        <div className="recommended-info">
          <p className="recommended-product-title">{item.title}</p>
          <div className="price-and-button">
            <p className="recommended-product-price">€{item.price}</p>
            <div className="button-add-container">
              <button className="button-add">Add</button>
            </div>
          </div>
        </div>
      </li>
    );
  });

  const animation = (type) => {
    if (type === "slideIn") {
      refDivToAnimation.current.classList.remove("animation-slide-out");
      refDivToAnimation.current.classList.add("animation-slide-in");
    } else if (type === "slideOut") {
      refDivToAnimation.current.classList.remove("animation-slide-in");
      refDivToAnimation.current.classList.add("animation-slide-out");
    }
  };

  return (
    <div className="App">
      <button className="button-animation" onClick={() => animation("slideIn")}>
        click me
      </button>
      <div className="background" onClick={() => animation("slideOut")}></div>
      <div className="minicart">
        <div className="section section-header">
          <h2>Cart ({items.length})</h2>
          <div
            className="button-container"
            onClick={() => animation("slideOut")}
          >
            <button className="button-x">X</button>
          </div>
        </div>
        <div className="sections-list-summary" ref={refDivToAnimation}>
          <div className="section section-list">
            <ul className="products-list">{listItems}</ul>
            <div className="recommended-products-subsection">
              <h4 className="recommended-products-header">
                Recommended products:
              </h4>
              <ul className="recommended-products">{listRecommended}</ul>
            </div>
          </div>
          <div className="section section-summary">
            <div className="section-summary-text">
              <p className="shipping">
                <span>Shipping:</span>{" "}
                <span>
                  {Data.currency}
                  {Data.shipping}
                </span>
              </p>
              <p className="order-total">
                <span>Order total:</span>{" "}
                <span>
                  {Data.currency} {getOrderTotal()}
                </span>
              </p>
            </div>
            <div className="button-container">
              <button className="button-checkout">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
