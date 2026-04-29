const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("./userAuth");

//signup
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (!username || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 4) {
      return res.status(400).json({ message: "Username length should be greater than 3" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length <= 5) {
      return res.status(400).json({ message: "Password length should be greater than 5" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, address });
    await newUser.save();
    return res.status(200).json({ message: "Signup Successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const authclaims = {
      name: existingUser.username,
      role: existingUser.role,
    };
    const token = jwt.sign({ authclaims }, "bookStore123", { expiresIn: "30d" });
    return res.status(200).json({ id: existingUser.id, role: existingUser.role, token });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get user info
router.get("/get-user-info", authenticateToken,async (req, res) => {
    try{
const {id} = req.headers;
const data = await User.findById(id).select('-password');
return res.status(200).json(data);

    }
    catch (error){
        res.status(500).json({ message: "server error"});
    }

});

//update address
router.put("/update-address", authenticateToken,async (req,res) => {
    try {
        const { id} = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address});
return res.status(200).json({ message: "address updated successfully"});

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;