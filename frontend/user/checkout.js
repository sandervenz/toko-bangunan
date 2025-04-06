document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Ambil informasi pelanggan dari form
    const customerName = checkoutForm.querySelector('#name').value;
    const customerEmail = checkoutForm.querySelector('#email').value;
    const customerAddress = checkoutForm.querySelector('#address').value;
    const customerPhone = checkoutForm.querySelector('#phone').value;
    
    // Misalkan data tambahan untuk transaksi
    const orderNumber = 'ORD' + new Date().getTime(); // Membuat nomor pemesanan berdasarkan timestamp
    const orderDate = new Date().toLocaleDateString();
    const customerCode = 'CUST' + new Date().getMilliseconds();
    const uniqueTransfer = Math.floor(Math.random() * 100000); // Angka acak sebagai kode unik transfer
    const paymentStatus = 'Belum Dibayar'; // Status pembayaran bisa diubah sesuai dengan proses

    // Menghitung total belanja
    const totalShopping = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Misalkan biaya kirim
    const shippingFee = 50000; // Asumsi biaya kirim tetap Rp 50.000
    
    // Grand total (total belanja + biaya kirim)
    const grandTotal = totalShopping + shippingFee;

    // Menampilkan data pemesanan
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-date').textContent = orderDate;
    document.getElementById('customer-code').textContent = customerCode;
    document.getElementById('customer-name').textContent = customerName;
    document.getElementById('customer-address').textContent = customerAddress;
    document.getElementById('customer-phone').textContent = customerPhone;
    document.getElementById('unique-transfer').textContent = uniqueTransfer;
    document.getElementById('payment-status').textContent = paymentStatus;

    // Menampilkan rincian barang
    const orderItemsTable = document.getElementById('order-items').getElementsByTagName('tbody')[0];
    cart.forEach((item, index) => {
        const row = orderItemsTable.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.name}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>${item.quantity}</td>
            <td>Rp ${(item.price * item.quantity).toLocaleString()}</td>
        `;
    });

    // Menampilkan total belanja, biaya kirim, dan grand total
    document.getElementById('total-shopping').textContent = totalShopping.toLocaleString();
    document.getElementById('shipping-fee').textContent = shippingFee.toLocaleString();
    document.getElementById('grand-total').textContent = grandTotal.toLocaleString();

    // Fungsi untuk cetak pemesanan
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print(); // Memanggil print dialog untuk mencetak halaman
    });
});
