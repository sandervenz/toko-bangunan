// Data Dummy
let categories = [
    { id: 1, name: "Elektronik" },
    { id: 2, name: "Pakaian" },
    { id: 3, name: "Makanan" },
    { id: 4, name: "Perabotan" }
];

let products = [
    { id: 1, name: "Laptop", category_id: 1, price: 8000000, stock: 10, description: "Laptop dengan spesifikasi tinggi", image: "laptop.jpg" },
    { id: 2, name: "Smartphone", category_id: 1, price: 5000000, stock: 15, description: "Smartphone terbaru", image: "smartphone.jpg" },
    { id: 3, name: "Kemeja", category_id: 2, price: 250000, stock: 30, description: "Kemeja formal", image: "shirt.jpg" },
    { id: 4, name: "Meja", category_id: 4, price: 1200000, stock: 5, description: "Meja kerja ergonomis", image: "table.jpg" }
];

let users = [
    { id: 1, name: "John Doe", email: "john@example.com", total_orders: 3 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", total_orders: 5 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", total_orders: 2 }
];

let orders = [
    { 
        id: "ORD-001", 
        user_id: 1, 
        date: "2023-05-15", 
        total: 8500000, 
        status: "completed",
        items: [
            { product_id: 1, name: "Laptop", price: 8000000, quantity: 1, subtotal: 8000000 },
            { product_id: 3, name: "Kemeja", price: 250000, quantity: 2, subtotal: 500000 }
        ]
    },
    { 
        id: "ORD-002", 
        user_id: 2, 
        date: "2023-05-18", 
        total: 5000000, 
        status: "shipped",
        items: [
            { product_id: 2, name: "Smartphone", price: 5000000, quantity: 1, subtotal: 5000000 }
        ]
    },
    { 
        id: "ORD-003", 
        user_id: 1, 
        date: "2023-05-20", 
        total: 250000, 
        status: "processed",
        items: [
            { product_id: 3, name: "Kemeja", price: 250000, quantity: 1, subtotal: 250000 }
        ]
    }
];

// DOM Elements
const menuItems = document.querySelectorAll('.menu li');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('page-title');

// Modal Elements
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const addProductBtn = document.getElementById('add-product-btn');
const closeModalBtns = document.querySelectorAll('.close, .close-modal');
const orderDetailModal = document.getElementById('order-detail-modal');

// Filter Elements
const productSearch = document.getElementById('product-search');
const categoryFilter = document.getElementById('category-filter');
const userSearch = document.getElementById('user-search');
const orderSearch = document.getElementById('order-search');
const orderStatusFilter = document.getElementById('order-status-filter');

// Tab Switching
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all menu items and tab contents
        menuItems.forEach(i => i.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked menu item and corresponding tab
        item.classList.add('active');
        const tabId = item.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
        
        // Update page title
        pageTitle.textContent = item.textContent.trim();
        
        // Refresh the table data
        if (tabId === 'products-tab') {
            renderProductsTable();
        } else if (tabId === 'users-tab') {
            renderUsersTable();
        } else if (tabId === 'orders-tab') {
            renderOrdersTable();
        }
    });
});

// Modal Functions
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners for Modals
addProductBtn.addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Tambah Produk Baru';
    productForm.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview').innerHTML = '';
    openModal(productModal);
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('close-modal')) {
            closeModal(productModal);
        } else {
            const modal = btn.closest('.modal');
            closeModal(modal);
        }
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(productModal);
        closeModal(orderDetailModal);
    }
});

// Form Submission
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const category_id = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    const imageInput = document.getElementById('product-image');
    
    // Handle image upload (in a real app, you would upload to server)
    let image = '';
    if (imageInput.files.length > 0) {
        image = imageInput.files[0].name;
    } else if (id) {
        // Keep existing image if editing and no new image is selected
        const existingProduct = products.find(p => p.id == id);
        image = existingProduct ? existingProduct.image : '';
    }
    
    if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { 
                id: parseInt(id), 
                name, 
                category_id: parseInt(category_id), 
                price, 
                stock, 
                description, 
                image 
            };
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            category_id: parseInt(category_id),
            price,
            stock,
            description,
            image
        });
    }
    
    renderProductsTable();
    closeModal(productModal);
});

// Image Preview
document.getElementById('product-image').addEventListener('change', function(e) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        }
        
        reader.readAsDataURL(this.files[0]);
    }
});

// Render Functions
function renderProductsTable(filteredProducts = products) {
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = '';
    
    // Populate category filter dropdown
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter.options.length <= 1) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }
    
    // Populate product form category dropdown
    const productCategory = document.getElementById('product-category');
    if (productCategory.options.length <= 0) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            productCategory.appendChild(option);
        });
    }
    
    filteredProducts.forEach((product, index) => {
        const category = categories.find(c => c.id === product.category_id);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                ${product.image ? 
                    `<img src="images/${product.image}" alt="${product.name}" class="product-image">` : 
                    '<div class="no-image">No Image</div>'}
            </td>
            <td>${product.name}</td>
            <td>${category ? category.name : 'N/A'}</td>
            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-primary edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger delete-product" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.getAttribute('data-id')));
    });
}

function renderUsersTable(filteredUsers = users) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = '';
    
    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.total_orders}</td>
            <td>
                <button class="btn-primary view-user-orders" data-id="${user.id}">
                    <i class="fas fa-eye"></i> Lihat Pesanan
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to view orders buttons
    document.querySelectorAll('.view-user-orders').forEach(btn => {
        btn.addEventListener('click', () => viewUserOrders(btn.getAttribute('data-id')));
    });
}

function renderOrdersTable(filteredOrders = orders) {
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    
    filteredOrders.forEach((order, index) => {
        const user = users.find(u => u.id === order.user_id);
        const statusClass = `status-${order.status}`;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.id}</td>
            <td>${user ? user.name : 'N/A'}</td>
            <td>${order.date}</td>
            <td>Rp ${order.total.toLocaleString('id-ID')}</td>
            <td><span class="status ${statusClass}">${order.status}</span></td>
            <td>
                <button class="btn-primary view-order-details" data-id="${order.id}">
                    <i class="fas fa-eye"></i> Detail
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-order-details').forEach(btn => {
        btn.addEventListener('click', () => viewOrderDetails(btn.getAttribute('data-id')));
    });
}

// CRUD Functions
function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    document.getElementById('modal-title').textContent = 'Edit Produk';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category_id;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description || '';
    
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '';
    if (product.image) {
        const img = document.createElement('img');
        img.src = `images/${product.image}`;
        img.alt = product.name;
        imagePreview.appendChild(img);
    }
    
    openModal(productModal);
}

function deleteProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id != id);
        renderProductsTable();
    }
}

function viewUserOrders(userId) {
    // Switch to orders tab
    document.querySelector('.menu li[data-tab="orders"]').click();
    
    // Filter orders by user
    const userOrders = orders.filter(o => o.user_id == userId);
    renderOrdersTable(userOrders);
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    const user = users.find(u => u.id === order.user_id);
    
    // Populate order info
    document.getElementById('order-id').textContent = order.id;
    document.getElementById('order-date').textContent = order.date;
    document.getElementById('order-status').textContent = order.status;
    document.getElementById('order-total').textContent = `Rp ${order.total.toLocaleString('id-ID')}`;
    
    // Populate customer info
    if (user) {
        document.getElementById('customer-name').textContent = user.name;
        document.getElementById('customer-email').textContent = user.email;
        document.getElementById('customer-address').textContent = 'Alamat pengiriman akan ditampilkan di sini';
    }
    
    // Populate order items
    const tbody = document.querySelector('#order-items-table tbody');
    tbody.innerHTML = '';
    
    order.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Rp ${item.price.toLocaleString('id-ID')}</td>
            <td>${item.quantity}</td>
            <td>Rp ${item.subtotal.toLocaleString('id-ID')}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Set current status in dropdown
    document.getElementById('update-status').value = order.status;
    
    // Update status button
    document.getElementById('update-status-btn').onclick = () => {
        const newStatus = document.getElementById('update-status').value;
        order.status = newStatus;
        renderOrdersTable();
        closeModal(orderDetailModal);
    };
    
    openModal(orderDetailModal);
}

// Filter Functions
productSearch.addEventListener('input', () => {
    const searchTerm = productSearch.value.toLowerCase();
    const categoryId = categoryFilter.value;
    
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            (p.description && p.description.toLowerCase().includes(searchTerm))
        );
    }
    
    if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.category_id == categoryId);
    }
    
    renderProductsTable(filteredProducts);
});

categoryFilter.addEventListener('change', () => {
    productSearch.dispatchEvent(new Event('input'));
});

userSearch.addEventListener('input', () => {
    const searchTerm = userSearch.value.toLowerCase();
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm) || 
        u.email.toLowerCase().includes(searchTerm)
    );
    
    renderUsersTable(filteredUsers);
});

orderSearch.addEventListener('input', () => {
    const searchTerm = orderSearch.value.toLowerCase();
    const status = orderStatusFilter.value;
    
    let filteredOrders = orders;
    
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(o => 
            o.id.toLowerCase().includes(searchTerm)
        );
    }
    
    if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    renderOrdersTable(filteredOrders);
});

orderStatusFilter.addEventListener('change', () => {
    orderSearch.dispatchEvent(new Event('input'));
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProductsTable();
    renderUsersTable();
    renderOrdersTable();
});