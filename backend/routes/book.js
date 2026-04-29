const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const {authenticateToken } = require("./userAuth");


//add book admin
router.post("/add-book" , authenticateToken , async (req ,res) => {
    try {
        const {id}= req.headers;
        const user = await User.findById(id);
if (user.role !== "admin"){

    return res.status(400).json({message: "You have not access"});
}

        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({message: "book added successfully"});
    } catch (error) {
       res.status(500).json({ message: "Server error" }); 
    }
});



const verifyAdmin = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Not authorized");
  return true;
};

//update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    await verifyAdmin(id);

    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      {
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book Updated successfully!", data: updatedBook });
  } catch (error) {
    console.log(error);
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: "You do not have access" });
    }
    return res.status(500).json({ message: "An error occurred" });
  }
});

//delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    await verifyAdmin(id);

    const deletedBook = await Book.findByIdAndDelete(bookid);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.log(error);
    if (error.message === "Not authorized") {
      return res.status(403).json({ message: "You do not have access" });
    }
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get recently added books limit 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get book by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;