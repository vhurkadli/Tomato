import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../components/context/StoreContext";
import { useNavigate } from "react-router-dom";
import PopUp from "../../components/PopUp/PopUp";
import { assets } from "../../assets/assets";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);
  const [showPopUp, setShowPopUp] = useState(false);

  const handleProceedToCheckOut = () => {
    localStorage.getItem("token") ? navigate("/order") : setShowPopUp(true);
  };

  useEffect(() => {
    let itemsAdded = Object.values(cartItems)?.reduce((acc, each) => {
      return (acc += each);
    }, 0);

    if (itemsAdded <= 0) {
      navigate("/");
    }
  }, [cartItems]);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr className="hr" />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index} className="details-container">
                <div className="cart-items-title-details cart-items-item">
                  <img className="item-pic" src={item.image} alt="" />
                  <div className="name-qnty">
                    <p>{item.name}</p>
                    <div className="hide-desk">
                      <div className="food-item-counter1">
                        <img
                          onClick={() => removeFromCart(item._id)}
                          src={assets.remove_icon_red}
                        />
                        <p>{cartItems[item._id]}</p>
                        <img
                          onClick={() => addToCart(item._id)}
                          src={assets.add_icon_green}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="each-price">₹{item.price}</p>
                  <p className="hide-mob">{cartItems[item._id]}</p>
                  <p className="total-price">
                    Rs.&nbsp;{item.price * cartItems[item._id]}.0
                  </p>
                  <p className="cross" onClick={() => removeFromCart(item._id)}>
                    x
                  </p>
                </div>
                <hr className="hr" />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>Rs.&nbsp;{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs.&nbsp;{getTotalCartAmount() && 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs.&nbsp;{getTotalCartAmount() && getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button onClick={handleProceedToCheckOut}>
            Proceed to Check Out
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have promocode enter here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
      {showPopUp && (
        <PopUp
          title={"Sign In Required !"}
          message={"Please Sign In to Proceed"}
          setShowPopUp={setShowPopUp}
        />
      )}
    </div>
  );
};

export default Cart;
