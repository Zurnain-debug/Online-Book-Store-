
const mongoose = require("mongoose");

const connectDb = async () => {
  const uri = process.env.URI || "mongodb://127.0.0.1:27017/bookstore";

  try {
    await mongoose.connect(uri);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = connectDb;