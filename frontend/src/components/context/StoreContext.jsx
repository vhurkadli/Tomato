import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import { food_list } from "../../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setcartItems] = useState({});
  // const url = "http://localhost:4000";
  const url="https://tomato-backend-vinayaks-projects.vercel.app"

  const [token, setToken] = useState("");
  const[food_list, setFoodList] = useState([])

  const addToCart = async (itemId) => {
    console.log("cartItems", cartItems);
    if (!cartItems[itemId]) {
      setcartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add",//url
        { itemId },//data iam sending to backend
        { headers: { token } }//token 
      );
    }
  };

  const removeFromCart = async(itemId) => {
    setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url + "/api/cart/remove",//url
        { itemId },//data iam sending to backend
        { headers: { token } }//token
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response?.data?.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      const cartData = response?.data?.cartData;
     
    if (cartData) {
      // console.log("cartResponse: ", cartData);
      setcartItems(cartData);
    } else {
      console.log("No cartData found in response.");
      setcartItems({});
    }
    } catch (error) {
      console.error("Error loading cart data:", error);
      setcartItems({});
    }
   
  };

  useEffect(() => {
    let loadData = async () => {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    };
    loadData();
  }, []);

  // useEffect(() => {
  //   async function loadData() {
  //     await fetchFoodList();
  //     if (localStorage.getItem("token")) {
  //       setToken(localStorage.getItem("token"));
  //       await loadCartData(localStorage.getItem("token"));
  //     }
  //   }
  //   loadData();
  // }, []);

  const contextValue = {
    food_list,
    cartItems,
    setcartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
