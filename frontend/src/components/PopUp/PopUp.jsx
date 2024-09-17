import React, { useEffect } from "react";
import "./PopUp.css";

const PopUp = ({ title, message, setShowPopUp }) => {
  useEffect(() => {
    document.body.style.position = "fixed"; 

    return () => {
      document.body.style.position = "static"; 
    };
  }, []);
  return (
    <div className="popup-container">
      <div className="popup-model">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={() => setShowPopUp(false)}>Close</button>
      </div>
    </div>
  );
};

export default PopUp;
