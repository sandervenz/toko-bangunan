const ordersTable = document.getElementById('orders-table').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('search');
const statusFilter = document.getElementById('status-filter');
const orderDetailModal = document.getElementById('order-detail-modal');
const closeModal = document.querySelector('.close');

let orders = [];

async function fetchOrders() {
    try {
        const response = await fetch('http://localhost/tokoBangunan/backend/admin/pemesanan/read.php', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        orders = data.data;
        renderOrdersTable(orders);
    } catch (error) {
        console.error('Gagal mengambil data pesanan:', error);
    }
}

function renderOrdersTable(filteredOrders = orders) {
    ordersTable.innerHTML = '';

    filteredOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        const statusClass = `status-${order.status}`;
        const status = order.status === 'pending' ? 'Pending' :
                       order.status === 'completed' ? 'Selesai' :
                       order.status === 'cancelled' ? 'Dibatalkan' : 'Tidak Diketahui';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.name}</td>
            <td>${order.email}</td>
            <td>${order.phone}</td>
            <td>Rp ${parseInt(order.total_price).toLocaleString('id-ID')}</td>
            <td><span class="status ${statusClass}">${status}</span></td>
            <td>
                <button class="btn-view view-detail" data-id="${order.order_id}">
                    <i class="fas fa-eye"></i> Detail
                </button>
            </td>
        `;
        ordersTable.appendChild(row);
    });

    document.querySelectorAll('.view-detail').forEach(btn => {
        btn.addEventListener('click', () => showOrderDetail(btn.getAttribute('data-id')));
    });
}

async function showOrderDetail(orderId) {
    try {
        const response = await fetch(`http://localhost/tokoBangunan/backend/admin/pemesanan/read.php/${orderId}`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        const order = data.data;

        // Informasi pelanggan
        document.getElementById('customer-name').textContent = order.name;
        document.getElementById('customer-email').textContent = order.email;
        document.getElementById('customer-phone').textContent = order.phone;
        document.getElementById('customer-address').textContent = order.address;

        // Info pesanan
        document.getElementById('order-total').textContent = `Rp ${parseInt(order.total_price).toLocaleString('id-ID')}`;
        document.getElementById('order-summary-total').textContent = `Rp ${parseInt(order.total_price).toLocaleString('id-ID')}`;
        document.getElementById('order-status').textContent = order.status;
        document.getElementById('status-select').value = order.status;

        const itemsTable = document.getElementById('order-items-table').getElementsByTagName('tbody')[0];
        itemsTable.innerHTML = '';

        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>Rp ${parseInt(item.price).toLocaleString('id-ID')}</td>
                <td>Rp ${(item.quantity * item.price).toLocaleString('id-ID')}</td>
            `;
            itemsTable.appendChild(row);
        });

        document.getElementById('update-status-btn').onclick = () => updateOrderStatus(order.order_id);
        document.getElementById('download-receipt-btn').onclick = () => downloadReceipt(order.order_id);

        orderDetailModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Gagal mengambil detail pesanan:', error);
    }
}

async function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('status-select').value;

    try {
        const response = await fetch(`http://localhost/tokoBangunan/backend/admin/pemesanan/update.php/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();
        alert(result.message || 'Status berhasil diupdate.');

        fetchOrders();
        closeOrderDetail();
    } catch (error) {
        console.error('Gagal update status:', error);
        alert('Terjadi kesalahan saat mengupdate status.');
    }
}

async function downloadReceipt(orderId) {
    try {
        const response = await fetch(`http://localhost/tokoBangunan/backend/public/struk.php/${orderId}`);

        if (!response.ok) throw new Error('Gagal download struk');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `struk_pesanan_${orderId}.pdf`; // ganti sesuai format file yang kamu hasilkan
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Gagal download struk:', error);
        alert('Gagal download struk. Silakan coba lagi.');
    }
}

function closeOrderDetail() {
    orderDetailModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function filterOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    let filtered = orders.data || orders;

    if (searchTerm) {
        filtered = filtered.filter(order =>
            order.name.toLowerCase().includes(searchTerm) ||
            order.email.toLowerCase().includes(searchTerm) ||
            order.phone.includes(searchTerm) ||
            order.order_id.toString().includes(searchTerm)
        );
    }

    if (status) {
        filtered = filtered.filter(order => order.status === status);
    }

    renderOrdersTable(filtered);
}

document.getElementById("produk-link").addEventListener("click", function () {
    window.location.href = "produk.html";
});
searchInput.addEventListener('input', filterOrders);
statusFilter.addEventListener('change', filterOrders);
closeModal.addEventListener('click', closeOrderDetail);
window.addEventListener('click', (e) => {
    if (e.target === orderDetailModal) closeOrderDetail();
});

document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        const response = await fetch('http://localhost/tokoBangunan/backend/admin/auth/logout.php', {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Logout gagal');

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Gagal logout:', error);
        alert('Gagal logout. Silakan coba lagi.');
    }
});

document.addEventListener('DOMContentLoaded', fetchOrders);
