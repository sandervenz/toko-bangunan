document.addEventListener('DOMContentLoaded', function () {
    let cart = [];  // Menyimpan produk dalam keranjang
    const cartCountElement = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.getElementById('closeBtn');
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    const addToCartButtons = document.querySelectorAll('.btn'); // Tombol untuk menambah produk ke keranjang

    // Menangani klik pada tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Mencegah reload halaman
            const productName = this.previousElementSibling.previousElementSibling.textContent; // Ambil nama produk
            const productPrice = parseInt(this.parentElement.querySelector('.harga').textContent.replace('Rp', '').replace(/\./g, '').trim()); // Ambil harga produk dari elemen yang ada
            addToCart(productName, productPrice);  // Tambahkan produk ke keranjang
        });
    });

    // Menambahkan produk ke dalam keranjang
    function addToCart(name, price) {
        const product = cart.find(item => item.name === name);  // Cari produk yang sudah ada
        if (product) {
            product.quantity++;  // Jika produk sudah ada, tambahkan jumlahnya
        } else {
            cart.push({ name, price, quantity: 1 });  // Jika produk belum ada, tambahkan produk baru
        }
        updateCart();  // Perbarui keranjang
    }

    // Memperbarui jumlah item di ikon keranjang dan menampilkan produk dalam modal
    function updateCart() {
        const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);  // Hitung total item dalam keranjang
        cartCountElement.textContent = cartCount;  // Perbarui jumlah di ikon keranjang
        renderCartItems();  // Render item di dalam modal
    }

    // Render item keranjang ke dalam modal
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsElement.innerHTML = "<p>Keranjang Anda kosong.</p>";  // Jika keranjang kosong, tampilkan pesan
        } else {
            cartItemsElement.innerHTML = '';  // Kosongkan item lama dalam modal
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <span>${item.name}</span>
                    <span class="harga">Rp ${item.price.toLocaleString()}</span>
                    <div>
                        <button class="change-quantity" data-action="increase" data-name="${item.name}">+</button>
                        <button class="change-quantity" data-action="decrease" data-name="${item.name}">-</button>
                    </div>
                    <i class="fas fa-trash delete-icon" data-name="${item.name}"></i>
                `;
                cartItemsElement.appendChild(cartItemElement);  // Tambahkan item ke modal
            });
        }

        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);  // Hitung total harga
        cartTotalElement.textContent = `Total: Rp ${total.toLocaleString()}`;  // Tampilkan total harga dalam modal
    }

    // Menangani event untuk menambah atau mengurangi jumlah produk dalam keranjang
    cartItemsElement.addEventListener('click', function (event) {
        if (event.target.classList.contains('change-quantity')) {
            const action = event.target.getAttribute('data-action');
            const productName = event.target.getAttribute('data-name');
            changeQuantity(productName, action);  // Ubah jumlah produk
        } else if (event.target.classList.contains('delete-icon')) {
            const productName = event.target.getAttribute('data-name');
            removeItemFromCart(productName);  // Hapus produk
        }
    });

    // Fungsi untuk menambah atau mengurangi jumlah produk
    function changeQuantity(name, action) {
        const product = cart.find(item => item.name === name);
        if (product) {
            if (action === 'increase') {
                product.quantity++;  // Tambah jumlah produk
            } else if (action === 'decrease' && product.quantity > 1) {
                product.quantity--;  // Kurangi jumlah produk (tidak bisa lebih kecil dari 1)
            }
            updateCart();  // Perbarui keranjang
        }
    }

    // Fungsi untuk menghapus produk dari keranjang
    function removeItemFromCart(name) {
        cart = cart.filter(item => item.name !== name);  // Hapus item dengan nama yang sesuai
        updateCart();  // Perbarui keranjang setelah menghapus item
    }

    // Menampilkan modal keranjang saat ikon keranjang diklik
    document.querySelector('.cart-icon').addEventListener('click', function () {
        cartModal.style.display = 'block';  // Tampilkan modal
    });

    // Menutup modal saat tombol close diklik
    closeBtn.addEventListener('click', function () {
        cartModal.style.display = 'none';  // Tutup modal
    });

    // Menutup modal jika klik di luar modal
    window.onclick = function (event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';  // Tutup modal jika klik di luar modal
        }
    };
});

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsElement.innerHTML = "<p>Keranjang Anda kosong.</p>";  // Jika keranjang kosong, tampilkan pesan
    } else {
        cartItemsElement.innerHTML = '';  // Kosongkan item lama dalam modal
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <span>${item.name}</span> <!-- Menampilkan nama produk -->
                <span class="harga">Rp ${item.price.toLocaleString()} x ${item.quantity}</span> <!-- Menampilkan harga per item dan jumlah produk -->
                <div>
                    <button class="change-quantity" data-action="increase" data-name="${item.name}">+</button>
                    <button class="change-quantity" data-action="decrease" data-name="${item.name}">-</button>
                </div>
                <i class="fas fa-trash delete-icon" data-name="${item.name}"></i>
            `;
            cartItemsElement.appendChild(cartItemElement);  // Tambahkan item ke modal
        });
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);  // Hitung total harga
    cartTotalElement.textContent = `Total: Rp ${total.toLocaleString()}`;  // Tampilkan total harga dalam modal
}

document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('.scroll-animate'); // Ambil semua header dengan class scroll-animate

    function checkScroll() {
        headers.forEach(function(header) {
            const headerPosition = header.getBoundingClientRect().top; // Posisi header relatif terhadap viewport

            // Jika header berada dalam jangkauan tampilan, tambahkan class untuk animasi
            if (headerPosition < window.innerHeight - 100) {
                header.classList.add('header-animate');
                header.classList.remove('scroll-animate'); // Hapus class scroll-animate setelah animasi dimulai
            }
        });
    }

    // Memanggil fungsi saat scroll
    window.addEventListener('scroll', checkScroll);

    // Memanggil fungsi saat pertama kali halaman dimuat
    checkScroll();
});

document.addEventListener('DOMContentLoaded', function () {
    const elementsToAnimate = document.querySelectorAll('.scroll-animate'); // Ambil semua elemen yang perlu dianimasikan

    // Fungsi untuk mengecek apakah elemen sudah berada dalam tampilan (viewport)
    function checkScroll() {
        elementsToAnimate.forEach(function (element) {
            const elementPosition = element.getBoundingClientRect().top; // Posisi elemen
            const elementHeight = element.offsetHeight; // Tinggi elemen

            if (elementPosition < window.innerHeight - elementHeight / 3) {
                element.classList.add('header-animate'); // Tambahkan class animasi jika elemen masuk viewport
                element.classList.remove('scroll-animate'); // Hapus class scroll-animate setelah animasi dimulai
            }
        });
    }

    // Menambahkan event listener untuk scroll
    window.addEventListener('scroll', checkScroll);

    // Memanggil fungsi pada saat halaman pertama kali dimuat
    checkScroll();
});

const menuToggle = document.getElementById("menu-toggle");
const navContainer = document.getElementById("nav-container");

menuToggle.addEventListener("click", () => {
    navContainer.classList.toggle("active");
});