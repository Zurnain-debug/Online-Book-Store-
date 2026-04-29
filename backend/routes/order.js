const router = require("express").Router();
const {authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");
const mongoose = require("mongoose");


//place order
// Place order
// Fixed place order route
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    console.log('=== PLACE ORDER START ===');
    const userId = req.headers.id;
    const { order } = req.body;

    console.log('User ID:', userId);
    console.log('Order data:', order);

    // Validate userId format
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log('❌ Invalid user ID format:', userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Validate order array
    if (!order || !Array.isArray(order) || order.length === 0) {
      console.log('❌ Invalid order array');
      return res.status(400).json({ message: "Order must be a non-empty array" });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: "User not found" });
    }
    console.log('✅ User found:', user.username);

    const orderIds = [];

    for (const orderData of order) {
      console.log('Processing order item:', orderData);

      // Validate book ID format
      if (!orderData._id || !mongoose.Types.ObjectId.isValid(orderData._id)) {
        console.log('❌ Invalid book ID format:', orderData._id);
        return res.status(400).json({ 
          message: `Invalid book ID format: ${orderData._id}` 
        });
      }

      // Verify book exists
      const book = await Book.findById(orderData._id);
      if (!book) {
        console.log('❌ Book not found:', orderData._id);
        return res.status(404).json({ 
          message: `Book not found: ${orderData._id}` 
        });
      }
      console.log('✅ Book found:', book.title);

      // Create new order with proper ObjectId conversion
      const newOrder = new Order({
        user: new mongoose.Types.ObjectId(userId),
        book: new mongoose.Types.ObjectId(orderData._id),
        status: "Order placed"  // Explicitly set status
      });

      console.log('Order object before save:', {
        user: newOrder.user,
        book: newOrder.book,
        status: newOrder.status
      });

      // Validate before saving
      const validationError = newOrder.validateSync();
      if (validationError) {
        console.log('❌ Validation error:', validationError.message);
        console.log('Validation details:', validationError.errors);
        return res.status(400).json({ 
          message: "Order validation failed", 
          details: validationError.message 
        });
      }

      const savedOrder = await newOrder.save();
      orderIds.push(savedOrder._id);
      console.log('✅ Order saved:', savedOrder._id);

      // Remove from cart
      await User.findByIdAndUpdate(userId, { 
        $pull: { cart: new mongoose.Types.ObjectId(orderData._id) } 
      });
      console.log('✅ Removed from cart');
    }

    // Add orders to user
    await User.findByIdAndUpdate(userId, { 
      $push: { orders: { $each: orderIds } } 
    });
    console.log('✅ Orders added to user');

    console.log('🎉 ORDER PLACEMENT SUCCESSFUL!');
    return res.json({ 
      status: "Success", 
      message: "Order Placed Successfully",
      orderCount: orderIds.length
    });

  } catch (error) {
    console.log('💥 ERROR in place-order:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      console.log('Validation errors details:');
      Object.keys(error.errors).forEach(key => {
        console.log(`- ${key}: ${error.errors[key].message}`);
      });
      
      return res.status(400).json({ 
        message: "Validation error", 
        details: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid ID format", 
        details: `Invalid ${error.path}: ${error.value}` 
      });
    }

    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

//get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const ordersData = (userData.orders || []).reverse();
    return res.json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

const verifyAdmin = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Not authorized");
  return true;
};

//get-all-orders ---admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    await verifyAdmin(id);

    const userData = await Order.find()
      .populate({ path: "book" })
      .populate({ path: "user" })
      .sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: "You do not have access" });
    }
    return res.status(500).json({ message: "An error occurred" });
  }
});

//update order --admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    await verifyAdmin(userId);
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, { status: req.body.status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      status: "Success",
      message: "Status Updated Successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: "You do not have access" });
    }
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;