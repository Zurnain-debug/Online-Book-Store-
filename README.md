# 📚 Online BookStore - Full Stack E-Commerce Application

A complete e-commerce platform for buying and selling books online with user authentication, shopping cart management, and admin functionality.

## Live Demo & Features

### **User Capabilities**
- 📝 User registration and secure login (JWT authentication)
- 🔍 Browse all books with detailed information
- 🛒 Shopping cart management (add/remove items)
- ❤️ Favorites/Wishlist functionality
- 📦 Place orders from cart
- 📋 Order history and status tracking
- 🔒 Secure password hashing with bcryptjs

### **Admin Capabilities**
- ➕ Add new books to the catalog
- ✏️ Update book information
- 🗑️ Delete books from catalog
- 👀 View all customer orders
- 🔄 Update order status (Order placed → Out for Delivery → Delivered)
- 👥 Role-based access control

---

## Technology Stack

### **Frontend**
- HTML5, CSS3, JavaScript (Vanilla - No Framework)
- Responsive design
- Local storage for session management
- Fetch API for backend communication

### **Backend**
- Node.js with Express.js framework
- MongoDB database with Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- bcryptjs for secure password hashing
- Jest & Supertest for testing
- CORS enabled for cross-origin requests

---

## Project Structure

```
Online-Book-Store/
├── backend/
│   ├── models/
│   │   ├── book.js          # Book data schema
│   │   ├── order.js         # Order data schema
│   │   └── user.js          # User data schema
│   ├── routes/
│   │   ├── book.js          # Book endpoints (CRUD)
│   │   ├── cart.js          # Cart management endpoints
│   │   ├── favourite.js     # Favorites endpoints
│   │   ├── order.js         # Order management endpoints
│   │   ├── user.js          # User profile endpoints
│   │   └── userAuth.js      # JWT authentication middleware
│   ├── conn/
│   │   └── conn.js          # MongoDB connection setup
│   ├── tests/
│   │   └── api.test.js      # Integration tests
│   ├── app.js               # Express server initialization
│   ├── package.json         # Node dependencies
│   ├── .env.example         # Environment variables template
│   └── .env                 # Environment configuration (local)
├── frontend/
│   ├── admin.html           # Main application HTML
│   ├── Untitled-1.html      # Alternative HTML version
│   ├── javascript.js        # Frontend logic & API calls
│   └── style.css            # Responsive styling
└── README.md                # This file
```

---

## Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or remote)
- npm or yarn package manager

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/Zurnain-debug/Online-Book-Store-.git
cd Online-Book-Store-
```

### **Step 2: Backend Setup**
```bash
cd backend
npm install
```

### **Step 3: Configure Environment**
Create a `.env` file in the `backend/` directory:
```
PORT=1000
URI=mongodb://localhost:27017/bookstore
```

### **Step 4: Start MongoDB**
```bash
mongod --dbpath ./mongodb_data
```

### **Step 5: Start Backend Server**
```bash
cd backend
npm start
# Server runs at http://localhost:1000
```

### **Step 6: Open Frontend**
Open `frontend/admin.html` or `frontend/Untitled-1.html` in your web browser

---

## API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/sign-up` | User registration |
| POST | `/api/v1/sign-in` | User login |

### **Books**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/get-all-books` | Fetch all books |
| GET | `/api/v1/get-recent-books` | Get 4 recently added books |
| GET | `/api/v1/get-book-by-id/:id` | Get specific book details |
| POST | `/api/v1/add-book` | Add new book (Admin) |
| PUT | `/api/v1/update-book` | Update book (Admin) |
| DELETE | `/api/v1/delete-book` | Delete book (Admin) |

### **Cart**
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/v1/add-to-cart` | Add book to cart |
| PUT | `/api/v1/remove-from-cart/:bookid` | Remove book from cart |
| GET | `/api/v1/get-user-cart` | Fetch user's cart |

### **Orders**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/place-order` | Place a new order |
| GET | `/api/v1/get-order-history` | Get user's order history |
| GET | `/api/v1/get-all-orders` | Get all orders (Admin) |
| PUT | `/api/v1/update-status/:id` | Update order status (Admin) |

### **Favorites**
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/v1/add-book-to-favourite` | Add to favorites |
| PUT | `/api/v1/remove-book-from-favourite` | Remove from favorites |
| GET | `/api/v1/get-favourite-books` | Get favorite books |

---

## Testing

Run the comprehensive test suite:
```bash
npm test
```

**Test Results:** All 3 integration tests pass ✅
- User signup and authentication
- Admin book management
- Shopping cart and order placement

---

## Sample Credentials

### **Regular User**
- Username: `testuser`
- Password: `password123`

### **Admin User**
- Username: `admin`
- Password: `admin123`

---

## Key Features Implemented

✅ **Security**
- JWT token-based authentication (30-day expiration)
- Password hashing with bcryptjs
- Role-based access control (User/Admin)
- Input validation on all endpoints

✅ **Database**
- MongoDB with Mongoose ODM
- Proper schema validation
- Relationship management (User → Orders → Books)

✅ **API**
- RESTful design
- Proper HTTP status codes
- Error handling and validation
- CORS enabled

✅ **Testing**
- Integration tests with Jest
- Database connectivity verification
- API endpoint testing

---

## Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Book reviews and ratings
- [ ] User profile management
- [ ] Order tracking timeline
- [ ] Admin analytics dashboard
- [ ] Inventory management system
- [ ] Multiple language support

---

## Troubleshooting

### **MongoDB Connection Error**
Make sure MongoDB is running:
```bash
mongod --dbpath ./mongodb_data
```

### **Port 1000 Already in Use**
Change the PORT in `.env` file to another port (e.g., 3000)

### **CORS Error**
Make sure the backend server is running and frontend API_BASE URL matches

---

## Contributing

Contributions are welcome! Feel free to fork, make changes, and submit pull requests.

---

## License

This project is open source and available for educational and commercial use.

---

## Contact & Support

- 📧 **Email:** Zurnain@bookstore.com
- 📱 **Phone:** +923244182590
- 📍 **Location:** Jubilee Town Block F, Lahore, Pakistan

---

## Repository Links

- **GitHub:** [Online-Book-Store](https://github.com/Zurnain-debug/Online-Book-Store-)
- **Live Demo:** (Coming Soon)

---

**Created:** April 2026 | **Last Updated:** April 2026
