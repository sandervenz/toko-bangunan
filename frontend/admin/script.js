// Data Dummy
const orders = [
    {
        id: 1,
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "081234567890",
            address: "Jl. Contoh No. 123, Jakarta"
        },
        total: 1250000,
        status: "pending",
        items: [
            { product: "Laptop", quantity: 1, price: 10000000 },
            { product: "Mouse", quantity: 2, price: 125000 }
        ],
        date: "2023-06-15"
    },
    {
        id: 2,
        customer: {
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "082345678901",
            address: "Jl. Sample No. 456, Bandung"
        },
        total: 750000,
        status: "diproses",
        items: [
            { product: "Keyboard", quantity: 1, price: 500000 },
            { product: "Headphone", quantity: 1, price: 250000 }
        ],
        date: "2023-06-16"
    },
    {
        id: 3,
        customer: {
            name: "Bob Johnson",
            email: "bob@example.com",
            phone: "083456789012",
            address: "Jl. Test No. 789, Surabaya"
        },
        total: 3000000,
        status: "dikirim",
        items: [
            { product: "Smartphone", quantity: 1, price: 3000000 }
        ],
        date: "2023-06-17"
    },
    {
        id: 4,
        customer: {
            name: "Alice Brown",
            email: "alice@example.com",
            phone: "084567890123",
            address: "Jl. Demo No. 321, Yogyakarta"
        },
        total: 1500000,
        status: "selesai",
        items: [
            { product: "Tablet", quantity: 1, price: 1500000 }
        ],
        date: "2023-06-18"
    }
];

// DOM Elements
const ordersTable = document.getElementById('orders-table').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('search');
const statusFilter = document.getElementById('status-filter');
const orderDetailModal = document.getElementById('order-detail-modal');
const closeModal = document.querySelector('.close');

// Render Orders Table
function renderOrdersTable(filteredOrders = orders) {
    ordersTable.innerHTML = '';
    
    filteredOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        const statusClass = `status-${order.status}`;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.customer.name}</td>
            <td>${order.customer.email}</td>
            <td>${order.customer.phone}</td>
            <td>Rp ${order.total.toLocaleString('id-ID')}</td>
            <td><span class="status ${statusClass}">${order.status}</span></td>
            <td>
                <button class="btn-view view-detail" data-id="${order.id}">
                    <i class="fas fa-eye"></i> Detail
                </button>
            </td>
        `;
        
        ordersTable.appendChild(row);
    });
    
    // Add event listeners to detail buttons
    document.querySelectorAll('.view-detail').forEach(btn => {
        btn.addEventListener('click', () => showOrderDetail(btn.getAttribute('data-id')));
    });
}

// Show Order Detail
function showOrderDetail(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    // Set customer info
    document.getElementById('customer-name').textContent = order.customer.name;
    document.getElementById('customer-email').textContent = order.customer.email;
    document.getElementById('customer-phone').textContent = order.customer.phone;
    document.getElementById('customer-address').textContent = order.customer.address;
    
    // Set order info
    document.getElementById('order-total').textContent = `Rp ${order.total.toLocaleString('id-ID')}`;
    document.getElementById('order-status').textContent = order.status;
    document.getElementById('status-select').value = order.status;
    
    // Set order items
    const itemsTable = document.getElementById('order-items-table').getElementsByTagName('tbody')[0];
    itemsTable.innerHTML = '';
    
    order.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>Rp ${item.price.toLocaleString('id-ID')}</td>
            <td>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
        `;
        itemsTable.appendChild(row);
    });
    
    // Update status button
    document.getElementById('update-status-btn').onclick = () => {
        const newStatus = document.getElementById('status-select').value;
        order.status = newStatus;
        renderOrdersTable();
        closeOrderDetail();
    };
    
    // Show modal
    orderDetailModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Order Detail
function closeOrderDetail() {
    orderDetailModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Filter Orders
function filterOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    
    let filtered = orders;
    
    if (searchTerm) {
        filtered = filtered.filter(order => 
            order.customer.name.toLowerCase().includes(searchTerm) || 
            order.customer.email.toLowerCase().includes(searchTerm) ||
            order.customer.phone.includes(searchTerm) ||
            order.id.toString().includes(searchTerm)
        );
    }
    
    if (status) {
        filtered = filtered.filter(order => order.status === status);
    }
    
    renderOrdersTable(filtered);
}

// Event Listeners
searchInput.addEventListener('input', filterOrders);
statusFilter.addEventListener('change', filterOrders);
closeModal.addEventListener('click', closeOrderDetail);
window.addEventListener('click', (e) => {
    if (e.target === orderDetailModal) {
        closeOrderDetail();
    }
});


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderOrdersTable();
});