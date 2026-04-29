
        // Configuration
        const API_BASE = 'http://localhost:1000/api/v1'; // Change this to your backend URL
        let currentUser = null;
        let authToken = null;

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthStatus();
            loadRecentBooks();
            loadAllBooks();
        });

        // Auth functions
        function checkAuthStatus() {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const userRole = localStorage.getItem('userRole');
            
            if (token && userId) {
                authToken = token;
                currentUser = { id: userId, role: userRole };
                updateUI(true);
            }
        }

        function updateUI(isLoggedIn) {
    const authBtn = document.getElementById('authBtn');
    const cartBtn = document.getElementById('cartBtn');
    const favBtn = document.getElementById('favBtn');
    const ordersBtn = document.getElementById('ordersBtn');
    const adminBtn = document.getElementById('adminBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isLoggedIn) {
        authBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';

        if (currentUser && currentUser.role === 'admin') {
            // Admin: show only admin-related button
            adminBtn.style.display = 'inline-block';
            cartBtn.style.display = 'none';
            favBtn.style.display = 'none';
            ordersBtn.style.display = 'none';
        } else {
            // Normal user: show user-related buttons
            adminBtn.style.display = 'none';
            cartBtn.style.display = 'inline-block';
            favBtn.style.display = 'inline-block';
            ordersBtn.style.display = 'inline-block';
        }
    } else {
        // Not logged in: show only auth button
        authBtn.style.display = 'inline-block';
        cartBtn.style.display = 'none';
        favBtn.style.display = 'none';
        ordersBtn.style.display = 'none';
        adminBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}


        async function signup() {
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const address = document.getElementById('signupAddress').value;

            if (!username || !email || !password || !address) {
                showAlert('Please fill all fields', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/sign-up`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password, address }),
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert('Account created successfully! Please login.', 'success');
                    showAuthForm('login');
                    clearSignupForm();
                } else {
                    showAlert(data.message || 'Signup failed', 'error');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'error');
            }
        }

        async function login() {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                showAlert('Please enter username and password', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/sign-in`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.id);
                    localStorage.setItem('userRole', data.role);

                    authToken = data.token;
                    currentUser = { id: data.id, role: data.role };

                    updateUI(true);
                    showSection('home');
                    clearLoginForm();

                    showAlert('Logged in successfully!', 'success');
                } else {
                    showAlert(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'error');
            }
        }

        function logout() {
            
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            
            authToken = null;
            currentUser = null;
            
            updateUI(false);
            location.reload();
            
            showSection('home');
        }

        // Book functions
        async function loadRecentBooks() {
            try {
                const response = await fetch(`${API_BASE}/get-recent-books`);
                const data = await response.json();

                document.getElementById('homeLoading').style.display = 'none';

                if (response.ok) {
                    displayBooks(data.data, 'recentBooks');
                } else {
                    showAlert('Failed to load recent books', 'error');
                }
            } catch (error) {
                document.getElementById('homeLoading').style.display = 'none';
                showAlert('Failed to load recent books', 'error');
            }
        }

        async function loadAllBooks() {
            try {
                const response = await fetch(`${API_BASE}/get-all-books`);
                const data = await response.json();

                document.getElementById('allBooksLoading').style.display = 'none';

                if (response.ok) {
                    displayBooks(data.data, 'allBooks');
                } else {
                    showAlert('Failed to load books', 'error');
                }
            } catch (error) {
                document.getElementById('allBooksLoading').style.display = 'none';
                showAlert('Failed to load books', 'error');
            }
        }

        function displayBooks(books, containerId) {
            const container = document.getElementById(containerId);
            
            if (!books || books.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No books found</h3></div>';
                return;
            }

            container.innerHTML = books.map(book => `
                <div class="book-card">
                    <img src="${book.url || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNkZGQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}" 
     alt="${book.title}" 
     class="book-image">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-price">$${book.price}</div>
                    <div class="book-actions">
                        <button class="btn btn-primary" onclick="showBookDetails('${book._id}')">Details</button>
                       ${authToken && currentUser?.role !== 'admin' ? `
    <button class="btn btn-success" onclick="addToCart('${book._id}')">Add to Cart</button>
    <button class="btn btn-secondary" onclick="addToFavourites('${book._id}')">❤️</button>
` : ''}

                        ${currentUser && currentUser.role === 'admin' ? `
                            <button class="btn btn-danger" onclick="deleteBook('${book._id}')">Delete</button>
                        ` : ''}

                        
                    </div>
                </div>
            `).join('');
        }

       async function showBookDetails(bookId) {
    try {
        const response = await fetch(`${API_BASE}/get-book-by-id/${bookId}`);
        const data = await response.json();
        
        if (response.ok) {
            const book = data.data;
            document.getElementById('bookDetails').innerHTML = `
                <img src="${book.url}" alt="${book.title}" style="width: 100%; max-width: 300px; border-radius: 10px; margin-bottom: 20px;" onerror="this.style.display='none'">
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Price:</strong> $${book.price}</p>
                <p><strong>Language:</strong> ${book.language}</p>
                <p><strong>Description:</strong></p>
                <p>${book.desc}</p>
                ${authToken && currentUser?.role !== 'admin' ? `
                    <div style="margin-top: 20px;">
                        <button class="btn btn-success" onclick="addToCart('${book._id}'); closeModal();">Add to Cart</button>
                        <button class="btn btn-secondary" onclick="addToFavourites('${book._id}'); closeModal();">Add to Favourites</button>
                    </div>
                ` : ''}
            `;
            document.getElementById('bookModal').style.display = 'block';
        }
    } catch (error) {
        showAlert('Failed to load book details', 'error');
    }
}

        async function addToCart(bookId) {
            if (!authToken) {
                showAlert('Please login to add books to cart', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/add-to-cart`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'bookid': bookId,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(data.message, 'success');
                } else {
                    showAlert(data.message || 'Failed to add to cart', 'error');
                }
            } catch (error) {
                showAlert('Network error', 'error');
            }
        }

        async function addToFavourites(bookId) {
            if (!authToken) {
                showAlert('Please login to add books to favourites', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/add-book-to-favourite`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'bookid': bookId,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(data.message, 'success');
                } else {
                    showAlert(data.message || 'Failed to add to favourites', 'error');
                }
            } catch (error) {
                showAlert('Network error', 'error');
            }
        }

        async function loadCart() {
            if (!authToken) return;

            document.getElementById('cartLoading').style.display = 'block';

            try {
                const response = await fetch(`${API_BASE}/get-user-cart`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();
                document.getElementById('cartLoading').style.display = 'none';

                if (response.ok) {
                    displayCartItems(data.data);
                } else {
                    showAlert('Failed to load cart', 'error');
                }
            } catch (error) {
                document.getElementById('cartLoading').style.display = 'none';
                showAlert('Failed to load cart', 'error');
            }
        }

        function displayCartItems(items) {
            const container = document.getElementById('cartItems');
            const placeOrderBtn = document.getElementById('placeOrderBtn');

            if (!items || items.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><p>Add some books to get started!</p></div>';
                placeOrderBtn.style.display = 'none';
                return;
            }

            placeOrderBtn.style.display = 'block';
            container.innerHTML = items.map(book => `
                <div class="cart-item">
                    <img src="${book.url}" alt="${book.title}" class="item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"><rect width=\"80\" height=\"80\" fill=\"%23ddd\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"12\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\">No Image</text></svg>'">
                    <div class="item-details">
                        <div class="item-title">${book.title}</div>
                        <div class="item-author">by ${book.author}</div>
                        <div class="item-price">${book.price}</div>
                    </div>
                    <button class="btn btn-danger" onclick="removeFromCart('${book._id}')">Remove</button>
                </div>
            `).join('');
        }

        async function removeFromCart(bookId) {
            try {
                const response = await fetch(`${API_BASE}/remove-from-cart/${bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(data.message, 'success');
                    loadCart();
                } else {
                    showAlert(data.message || 'Failed to remove from cart', 'error');
                }
            } catch (error) {
                showAlert('Network error', 'error');
            }
        }

       async function placeOrder() {
  try {
    console.log('Starting place order process...');
    console.log('Current user:', currentUser);
    console.log('Auth token:', authToken);

    // 1. Get cart items for current user
    const cartResponse = await fetch(`${API_BASE}/get-user-cart`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'id': currentUser.id,
      },
    });

    console.log('Cart response status:', cartResponse.status);
    const cartData = await cartResponse.json();
    console.log('Cart data:', cartData);

    if (!cartResponse.ok) {
      showAlert(`Failed to get cart: ${cartData.message}`, 'error');
      return;
    }

    if (!cartData.data || !Array.isArray(cartData.data) || cartData.data.length === 0) {
      showAlert('Your cart is empty', 'error');
      return;
    }

    // 2. Prepare order data - ensure each item has _id
    const orderItems = cartData.data.map(item => ({
      _id: item._id
    }));

    console.log('Order items to send:', orderItems);

    // 3. Send order array to backend
    const orderResponse = await fetch(`${API_BASE}/place-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'id': currentUser.id,
      },
      body: JSON.stringify({ order: orderItems }),
    });

    console.log('Order response status:', orderResponse.status);
    const orderResult = await orderResponse.json();
    console.log('Order result:', orderResult);

    if (orderResponse.ok) {
      showAlert(orderResult.message || 'Order placed successfully!', 'success');
      loadCart(); // Refresh cart UI
      // Optionally redirect to orders page
      // showSection('orders');
    } else {
      showAlert(orderResult.message || 'Failed to place order', 'error');
    }
  } catch (error) {
    console.error("PlaceOrder frontend error:", error);
    showAlert('Network error occurred while placing order', 'error');
  }
}


        async function loadFavourites() {
            if (!authToken) return;

            document.getElementById('favouritesLoading').style.display = 'block';

            try {
                const response = await fetch(`${API_BASE}/get-favourite-books`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();
                document.getElementById('favouritesLoading').style.display = 'none';

                if (response.ok) {
                    displayFavouriteItems(data.data);
                } else {
                    showAlert('Failed to load favourites', 'error');
                }
            } catch (error) {
                document.getElementById('favouritesLoading').style.display = 'none';
                showAlert('Failed to load favourites', 'error');
            }
        }

        function displayFavouriteItems(items) {
            const container = document.getElementById('favouriteItems');

            if (!items || items.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No favourite books</h3><p>Add some books to your favourites!</p></div>';
                return;
            }

            container.innerHTML = items.map(book => `
                <div class="cart-item">
                    <img src="${book.url}" alt="${book.title}" class="item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"><rect width=\"80\" height=\"80\" fill=\"%23ddd\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"12\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\">No Image</text></svg>'">
                    <div class="item-details">
                        <div class="item-title">${book.title}</div>
                        <div class="item-author">by ${book.author}</div>
                        <div class="item-price">${book.price}</div>
                    </div>
                    <div>
                        <button class="btn btn-success" onclick="addToCart('${book._id}')" style="margin-bottom: 10px;">Add to Cart</button>
                        <button class="btn btn-danger" onclick="removeFromFavourites('${book._id}')">Remove</button>
                    </div>
                </div>
            `).join('');
        }

        async function removeFromFavourites(bookId) {
            try {
                const response = await fetch(`${API_BASE}/remove-book-from-favourite`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'bookid': bookId,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(data.message, 'success');
                    loadFavourites();
                } else {
                    showAlert(data.message || 'Failed to remove from favourites', 'error');
                }
            } catch (error) {
                showAlert('Network error', 'error');
            }
        }

        async function loadOrders() {
            if (!authToken) return;

            document.getElementById('ordersLoading').style.display = 'block';

            try {
                const response = await fetch(`${API_BASE}/get-order-history`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();
                document.getElementById('ordersLoading').style.display = 'none';

                if (response.ok) {
                    displayOrderItems(data.data);
                } else {
                    showAlert('Failed to load orders', 'error');
                }
            } catch (error) {
                document.getElementById('ordersLoading').style.display = 'none';
                showAlert('Failed to load orders', 'error');
            }
        }

        function displayOrderItems(orders) {
            const container = document.getElementById('orderItems');

            if (!orders || orders.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No orders yet</h3><p>Place your first order!</p></div>';
                return;
            }

            container.innerHTML = orders.map(order => `
                <div class="order-item">
                    <img src="${order.book.url}" alt="${order.book.title}" class="item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"><rect width=\"80\" height=\"80\" fill=\"%23ddd\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"12\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\">No Image</text></svg>'">
                    <div class="item-details">
                        <div class="item-title">${order.book.title}</div>
                        <div class="item-author">by ${order.book.author}</div>
                        <div class="item-price">${order.book.price}</div>
                        <div style="margin-top: 10px;">
                            <span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>
                        </div>
                        <div style="margin-top: 5px; color: #666; font-size: 14px;">
                            Ordered on: ${new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function getStatusClass(status) {
            switch(status.toLowerCase()) {
                case 'order placed': return 'status-placed';
                case 'out for delivery': return 'status-delivery';
                case 'delivered': return 'status-delivered';
                case 'canceled': return 'status-cancelled';
                default: return 'status-placed';
            }
        }

        // Admin functions
        async function addBook() {
            const url = document.getElementById('bookUrl').value;
            const title = document.getElementById('bookTitle').value;
            const author = document.getElementById('bookAuthor').value;
            const price = document.getElementById('bookPrice').value;
            const desc = document.getElementById('bookDesc').value;
            const language = document.getElementById('bookLanguage').value;

            if (!url || !title || !author || !price || !desc || !language) {
                showAlert('Please fill all fields', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/add-book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'id': currentUser.id
                    },
                    body: JSON.stringify({ url, title, author, price: parseFloat(price), desc, language }),
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(data.message, 'success');
                    clearBookForm();
                    loadAllBooks(); // Refresh books
                } else {
                    showAlert(data.message || 'Failed to add book', 'error');
                }
            } catch (error) {
                showAlert('Network error', 'error');
            }
        }

        async function deleteBook(bookId) {
            if (!confirm('Are you sure you want to delete this book?')) {
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/delete-book`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'bookid': bookId,
                        'id': currentUser.id,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(data.message, 'success');
                    loadAllBooks(); // Refresh books
                } else {
                    showAlert(data.message || 'Failed to delete book', 'error');
                }
            } catch (error) {
                showAlert('Network error', 'error');
            }
        }

        async function loadAdminOrders() {
            if (!authToken || currentUser.role !== 'admin') return;

            document.getElementById('adminOrdersLoading').style.display = 'block';

            try {
                const response = await fetch(`${API_BASE}/get-all-orders`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'id': currentUser.id
                    },
                });

                const data = await response.json();
                document.getElementById('adminOrdersLoading').style.display = 'none';

                if (response.ok) {
                    displayAdminOrders(data.data);
                } else {
                    showAlert('Failed to load orders', 'error');
                }
            } catch (error) {
                document.getElementById('adminOrdersLoading').style.display = 'none';
                showAlert('Failed to load orders', 'error');
            }
        }

        function displayAdminOrders(orders) {
            const container = document.getElementById('adminOrders');

            if (!orders || orders.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No orders found</h3></div>';
                return;
            }

            container.innerHTML = orders.map(order => `
                <div class="order-item">
                    <img src="${order.book.url}" alt="${order.book.title}" class="item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"><rect width=\"80\" height=\"80\" fill=\"%23ddd\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"12\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\">No Image</text></svg>'">
                    <div class="item-details">
                        <div class="item-title">${order.book.title}</div>
                        <div class="item-author">by ${order.book.author}</div>
                        <div class="item-price">${order.book.price}</div>
                        <div style="margin-top: 10px;">
                            <strong>Customer:</strong> ${order.user.username} (${order.user.email})
                        </div>
                        <div style="margin-top: 5px;">
                            <strong>Address:</strong> ${order.user.address}
                        </div>
                        <div style="margin-top: 10px;">
                            <span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>
                        </div>
                        <div style="margin-top: 5px; color: #666; font-size: 14px;">
                            Ordered on: ${new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div>
                        <select id="status-${order._id}" style="margin-bottom: 10px; padding: 5px;">
                                <option value="Order placed" ${order.status === 'Order placed' ? 'selected' : ''}>Order Placed</option>
                            <option value="Out for Delivery" ${order.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="Canceled" ${order.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
                        </select>
                        <button class="btn btn-primary" onclick="updateOrderStatus('${order._id}')">Update Status</button>
                    </div>
                </div>
            `).join('');
        }

        async function updateOrderStatus(orderId) {
            const statusSelect = document.getElementById(`status-${orderId}`);
            const newStatus = statusSelect.value;

            try {
                const response = await fetch(`${API_BASE}/update-status/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'id': currentUser.id
                    },
                    body: JSON.stringify({ status: newStatus }),
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(data.message, 'success');
                    loadAdminOrders(); // Refresh orders
                } else {
                    showAlert(data.message || 'Failed to update status', 'error');
                }
            } catch (error) {
                showAlert('Network error', 'error');
            }
        }

        // UI Helper functions
        function showSection(sectionName) {
            // Hide all sections
            const sections = document.getElementsByClassName('section');
            for (let section of sections) {
                section.classList.remove('active');
            }

            // Show selected section
            document.getElementById(sectionName).classList.add('active');

            // Load data for specific sections
            switch(sectionName) {
                case 'cart':
                    loadCart();
                    break;
                case 'favourites':
                    loadFavourites();
                    break;
                case 'orders':
                    loadOrders();
                    break;
                case 'admin':
                    if (currentUser && currentUser.role === 'admin') {
                        showAdminForm('addBook');
                    }
                    break;
            }
        }

        function showAuthForm(formType) {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');

            if (formType === 'login') {
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            }
        }

        function showAdminForm(formType) {
            const addBookForm = document.getElementById('addBookForm');
            const manageOrdersForm = document.getElementById('manageOrdersForm');

            if (formType === 'addBook') {
                addBookForm.style.display = 'block';
                manageOrdersForm.style.display = 'none';
            } else {
                addBookForm.style.display = 'none';
                manageOrdersForm.style.display = 'block';
                loadAdminOrders();
            }
        }

        function showAlert(message, type) {
            const alertContainer = document.getElementById('alertContainer');
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.textContent = message;

            alertContainer.appendChild(alertDiv);

            // Remove alert after 5 seconds
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }

        function closeModal() {
            document.getElementById('bookModal').style.display = 'none';
        }

        function clearLoginForm() {
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
        }

        function clearSignupForm() {
            document.getElementById('signupUsername').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
            document.getElementById('signupAddress').value = '';
        }

        function clearBookForm() {
            document.getElementById('bookUrl').value = '';
            document.getElementById('bookTitle').value = '';
            document.getElementById('bookAuthor').value = '';
            document.getElementById('bookPrice').value = '';
            document.getElementById('bookDesc').value = '';
            document.getElementById('bookLanguage').value = '';
        }

        // Close modal when clicking outside of it
        window.onclick = function(event) {
            const modal = document.getElementById('bookModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    