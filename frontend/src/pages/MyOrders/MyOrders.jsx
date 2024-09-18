import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../components/context/StoreContext";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { io } from 'socket.io-client';

const MyOrders = () => {
  const { token, url,cartItems } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const socket = io(url);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    setData(response.data.data);
  };

  useEffect(() => {
    console.log("token", token);
    if (token) {
      fetchOrders();
    }
  }, [token]);


  useEffect(() => {
    socket.on('orderStatusUpdated', (updatedOrder) => {
      console.log("updatedOrder",updatedOrder)
      setData((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="my-orders">
      {data.length > 0 && <h2>My Orders</h2>}

      <div className="container">
        {!data.length ? (
          <div className="img-container">
            <p>
              Cart is Empty!{" "}
              <Link to="/" style={{ color: "tomato" }}>
                Click here
              </Link>{" "}
              to go to food Menu{" "}
            </p>
            <img className="img-empty-basket" src={assets.ShoppingBasket} />
          </div>
        ) : (
          data.map((order, index) => {
            return (
              <>
                <div key={index} className="my-orders-order">
                  <img src={assets.parcel_icon} alt="" />
                  <p>
                    {order.items.map((item, index) => {
                      if (order.items.length - 1 === index) {
                        return item.name + " X " + item.quantity;
                      } else {
                        return item.name + " X " + item.quantity + ", ";
                      }
                    })}
                  </p>
                  <p>Rs.&nbsp;{order.amount}</p>
                  <p>Items&nbsp;:&nbsp;{order.items.length}</p>
                  <p className="loader-status">
                    {order.status === "Delivered" ? (
                      <>
                        <span>&#x25cf;</span>
                        <b>&nbsp;{order.status}</b>
                      </>
                    ) : (
                      <>
                      <div className="spinner"></div>
                      <b>&nbsp;{order.status}</b>
                      </>
                    )}
                  </p>
                  <button onClick={fetchOrders}>Track Order</button>
                <img className="clock-img" src={assets.parcel_icon} alt="" />
                </div>
              </>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;

