const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: [true, "Book is required"],
    },
    status: {
      type: String,
      default: "Order placed",
      enum: {
        values: ["Order placed", "Out for Delivery", "Delivered", "Canceled"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", orderSchema);