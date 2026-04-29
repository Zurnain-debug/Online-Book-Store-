const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let app;

beforeAll(async () => {
  process.env.URI = process.env.URI || 'mongodb://127.0.0.1:27017/bookstore_test';
  app = require('../app');
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('Backend API integration', () => {
  let adminToken;
  let adminId;
  let userToken;
  let userId;
  let bookId;

  test('should signup and sign in a new user', async () => {
    const signupResponse = await request(app)
      .post('/api/v1/sign-up')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        address: '123 Test St',
      });

    expect(signupResponse.status).toBe(200);
    expect(signupResponse.body.message).toMatch(/Signup Successfully/i);

    const signinResponse = await request(app)
      .post('/api/v1/sign-in')
      .send({ username: 'testuser', password: 'password123' });

    expect(signinResponse.status).toBe(200);
    expect(signinResponse.body.token).toBeDefined();
    expect(signinResponse.body.id).toBeDefined();

    userToken = signinResponse.body.token;
    userId = signinResponse.body.id;
  });

  test('should create admin user and add a book', async () => {
    const User = require('../models/user');
    const adminUser = new User({
      username: 'adminuser',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpass', 10),
      address: '456 Admin Ave',
      role: 'admin',
    });
    await adminUser.save();

    const signinResponse = await request(app)
      .post('/api/v1/sign-in')
      .send({ username: 'adminuser', password: 'adminpass' });

    expect(signinResponse.status).toBe(200);
    expect(signinResponse.body.token).toBeDefined();
    expect(signinResponse.body.role).toBe('admin');

    adminToken = signinResponse.body.token;
    adminId = signinResponse.body.id;

    const addBookResponse = await request(app)
      .post('/api/v1/add-book')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('id', adminId)
      .send({
        url: 'https://example.com/book.jpg',
        title: 'Test Book',
        author: 'Test Author',
        price: 19.99,
        desc: 'A book used for testing',
        language: 'English',
      });

    expect(addBookResponse.status).toBe(200);
    expect(addBookResponse.body.message).toMatch(/book added successfully/i);

    const booksResponse = await request(app).get('/api/v1/get-all-books');
    expect(booksResponse.status).toBe(200);
    expect(Array.isArray(booksResponse.body.data)).toBe(true);
    expect(booksResponse.body.data.length).toBeGreaterThan(0);

    bookId = booksResponse.body.data[0]._id;
  });

  test('should add book to cart and place an order', async () => {
    const addCartResponse = await request(app)
      .put('/api/v1/add-to-cart')
      .set('Authorization', `Bearer ${userToken}`)
      .set('id', userId)
      .set('bookid', bookId);

    expect(addCartResponse.status).toBe(200);
    expect(addCartResponse.body.message).toMatch(/Book added to cart/i);

    const cartResponse = await request(app)
      .get('/api/v1/get-user-cart')
      .set('Authorization', `Bearer ${userToken}`)
      .set('id', userId);

    expect(cartResponse.status).toBe(200);
    expect(Array.isArray(cartResponse.body.data)).toBe(true);
    expect(cartResponse.body.data[0]._id).toBe(bookId);

    const placeOrderResponse = await request(app)
      .post('/api/v1/place-order')
      .set('Authorization', `Bearer ${userToken}`)
      .set('id', userId)
      .send({ order: [{ _id: bookId }] });

    expect(placeOrderResponse.status).toBe(200);
    expect(placeOrderResponse.body.message).toMatch(/Order Placed Successfully/i);

    const orderHistoryResponse = await request(app)
      .get('/api/v1/get-order-history')
      .set('Authorization', `Bearer ${userToken}`)
      .set('id', userId);

    expect(orderHistoryResponse.status).toBe(200);
    expect(Array.isArray(orderHistoryResponse.body.data)).toBe(true);
    expect(orderHistoryResponse.body.data.length).toBe(1);
    expect(orderHistoryResponse.body.data[0].book._id).toBe(bookId);
  });
});
