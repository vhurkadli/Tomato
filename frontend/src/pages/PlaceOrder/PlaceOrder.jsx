import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../components/context/StoreContext";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
 const navigate=useNavigate()

  const onChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    console.log("orderitems_v", orderItems);
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    console.log("orderData", orderData);
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }
  };


  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount() == 0){
      navigate('/cart')
    }
  },[token])
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            type="text"
            name="firstName"
            onChange={onChange}
            value={data.firstName}
            placeholder="First Name"
          />
          <input
            required
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={onChange}
            placeholder="Last Name"
          />
        </div>

        <input
          required
          type="email"
          name="email"
          value={data.email}
          onChange={onChange}
          placeholder="Email address"
        />
        <input
          required
          type="text"
          name="street"
          value={data.street}
          onChange={onChange}
          placeholder="Street"
        />

        <div className="multi-fields">
          <input
            required
            type="text"
            name="city"
            value={data.city}
            onChange={onChange}
            placeholder="City"
          />
          <input
            required
            type="text"
            name="state"
            value={data.state}
            onChange={onChange}
            placeholder="State"
          />
        </div>

        <div className="multi-fields">
          <input
            required
            type="text"
            name="zipcode"
            value={data.zipcode}
            onChange={onChange}
            placeholder="Zip Code"
          />
          <input
            required
            type="text"
            name="country"
            value={data.country}
            onChange={onChange}
            placeholder="Country"
          />
        </div>
        <input
          required
          type="text"
          name="phone"
          value={data.phone}
          onChange={onChange}
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() && 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() && getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
