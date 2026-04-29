const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const connectDb = require("./conn/conn");

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

const PORT = process.env.PORT || 1000;

// Enable CORS for your frontend origin
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

connectDb()
  .then(() => {
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

module.exports = app;
