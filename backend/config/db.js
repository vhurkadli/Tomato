import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://vvhurkadli:2tg08me058@cluster0.3pse4.mongodb.net/food-del"
    )
    .then(() => console.log("DB Connected"));
}; 
