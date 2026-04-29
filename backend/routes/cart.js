const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken } = require("./userAuth");


//put book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    const isBookinCart = userData.cart.some((cartId) => cartId.toString() === bookid);
    if (isBookinCart) {
      return res.json({
        status: "Success",
        message: "Book is already in cart",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//remove from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book removed from cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get cart of a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    console.log("User ID from headers:", id);

    const userData = await User.findById(id).populate("cart");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = userData.cart.reverse();

    return res.json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    console.error("Detailed error:", error);  // Logs error to your terminal or console
    return res.status(500).json({ message: error.message || "An error occurred" });  // Sends error message back to client
  }
});


module.exports = router;