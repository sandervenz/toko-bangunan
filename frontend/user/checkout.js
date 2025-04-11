document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const form = document.getElementById('checkoutForm');

    console.log("Cart yang dikirim:", cart);

    const checkoutTableBody = document.querySelector('#checkoutItems tbody');
    let totalHarga = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>${item.quantity}</td>
        `;
        checkoutTableBody.appendChild(row);
        totalHarga += item.price * item.quantity;
    });

    document.getElementById('checkoutTotal').textContent = totalHarga.toLocaleString();


    // Handle submit form
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const address = form.querySelector('#address').value.trim();
        const phone = form.querySelector('#phone').value.trim();

        if (!name || !email || !address || !phone) {
            alert('Semua field wajib diisi.');
            return;
        }

        // Tampilkan data di modal
        document.getElementById('confirmName').textContent = name;
        document.getElementById('confirmEmail').textContent = email;
        document.getElementById('confirmAddress').textContent = address;
        document.getElementById('confirmPhone').textContent = phone;

        const tbody = document.querySelector('#confirmTable tbody');
        tbody.innerHTML = '';
        let totalHarga = 0;
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="border: 1px solid #ccc; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">Rp ${item.price.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
            totalHarga += item.price * item.quantity;
        });

        // Tambahkan total harga di bawah tabel
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td colspan="2" style="border: 1px solid #ccc; padding: 8px; text-align: right;"><strong>Total</strong></td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: right;"><strong>Rp ${totalHarga.toLocaleString()}</strong></td>
        `;
        tbody.appendChild(totalRow);

        showModal('confirmationModal');
    });

    // Handle tombol "Pesan"
    document.getElementById('submitOrderBtn').addEventListener('click', function () {
        const payload = {
            name: document.getElementById('confirmName').textContent,
            email: document.getElementById('confirmEmail').textContent,
            address: document.getElementById('confirmAddress').textContent,
            phone: document.getElementById('confirmPhone').textContent,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        };

        fetch('http://localhost/tokoBangunan/backend/public/order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            closeModal('confirmationModal');
            localStorage.removeItem('cart'); // Kosongkan keranjang
            showModal('successModal');

            document.getElementById('downloadReceiptBtn').onclick = async function () {
                const orderId = data.order_id;
            
                try {
                    const res = await fetch(`http://localhost/tokoBangunan/backend/public/struk.php/${orderId}`);
                    if (!res.ok) throw new Error('Gagal mengunduh struk');
            
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
            
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `struk_pesanan_${orderId}.pdf`; // Ganti ekstensi sesuai file
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                } catch (err) {
                    alert('Struk tidak bisa diunduh. Silakan coba lagi.');
                    console.error('Download error:', err);
                }
            };            
        })
        .catch(err => {
            alert('Gagal memproses pesanan.');
            console.error(err);
        });
    });
});

function showModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
