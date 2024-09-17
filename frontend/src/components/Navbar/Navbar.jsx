import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import PopUp from "../PopUp/PopUp";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showPopUp, setShowPopUp] = useState(false);
  const { getTotalCartAmount, token, setToken,cartItems } = useContext(StoreContext);
  const[itemAdded,setItemAdded]=useState(0)

  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

 

  const handleCartClick = (e) => {  
    if (itemAdded <= 0) {
      e.preventDefault();
      setShowPopUp(true);
    } else {
      navigate("/cart");
    }
  };

  useEffect(() => {
    console.log("cartItems",cartItems,Object.values(cartItems)?.length)
    const updatedCart = Object.values(cartItems)?.reduce((acc, each) => {
      return (acc += each);
    }, 0);

    setItemAdded(updatedCart);
  }, [cartItems]);

  return (
    <div className="navbar">
      <Link to="/">
        <h2 className="restaurant-name">Vi Cuisine</h2>
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        <img className="search-icon" src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          {/* <Link to="/cart" onClick={handleCartClick}> */}
          <img
            className="basket-icon"
            src={assets.basket_icon}
            alt=""
            onClick={handleCartClick}
          />
          {/* </Link> */}
          <div
            className={getTotalCartAmount() === 0 ? "" : "dot"}
            onClick={handleCartClick}
          >
            {itemAdded > 0 &&
              (getTotalCartAmount() === 0
                ? ""
                : Object.values(cartItems).filter((val) => val !== 0)?.length)}
          </div>
        </div>

        {token ? (
          <div className="navbar-profile">
            <img className="profile-icon" src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} alt="" />
                <p onClick={() => navigate("/myorders")}>Orders</p>
              </li>
              <hr />
              <li onClick={logOut}>
                {" "}
                <img src={assets.logout_icon} alt="" />
                <p>Log Out</p>
              </li>
            </ul>
          </div>
        ) : (
          <button className="sign-in-button" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        )}
      </div>
      {showPopUp && (
        <PopUp
          title={"Cart is Empty!"}
          message={"Add Items in Cart"}
          setShowPopUp={setShowPopUp}
        />
      )}
    </div>
  );
};

export default Navbar;
