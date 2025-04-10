document.addEventListener('DOMContentLoaded', function () {
    const cartCountElement = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.getElementById('closeBtn');
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    loadProducts();
    updateCart();

    function loadProducts() {
        fetch('http://localhost/tokoBangunan/backend/public/read.php')
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    renderProducts(data.data);
                }
            })
            .catch(error => console.error('Gagal memuat produk:', error));
    }

    function renderProducts(products) {
        const container = document.querySelector('.produk-container');
        container.innerHTML = '';
    
        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'produk-item';
    
            let addToCartButton = '';
            if (product.stock > 0) {
                addToCartButton = `<a href="#" class="btn" data-name="${product.name}" data-price="${product.price}" data-stock="${product.stock}">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </a>`;
            } else {
                addToCartButton = `<span class="btn disabled" style="opacity: 0.5; cursor: not-allowed;">Stok Habis</span>`;
            }
    
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="harga">Rp ${parseInt(product.price).toLocaleString()}</p>
                <p class="stok">Stok: ${product.stock}</p>
                ${addToCartButton}
            `;
            container.appendChild(item);
        });
    
        addToCartEvent();
    }
    
    function addToCartEvent() {
        const addToCartButtons = document.querySelectorAll('.btn[data-stock]');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const productName = this.getAttribute('data-name');
                const productPrice = parseInt(this.getAttribute('data-price'));
                const productStock = parseInt(this.getAttribute('data-stock'));
    
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProduct = cart.find(item => item.name === productName);
    
                if (existingProduct && existingProduct.quantity >= productStock) {
                    alert(`Stok ${productName} hanya tersedia ${productStock}`);
                    return;
                }
    
                addToCart(productName, productPrice);
            });
        });
    }
    
    function addToCart(name, price) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = cart.find(item => item.name === name);

        if (product) {
            product.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountElement.textContent = cartCount;
        renderCartItems();
    }

    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const checkoutBtn = document.getElementById('checkoutBtn');
    
        if (cart.length === 0) {
            cartItemsElement.innerHTML = "<p>Keranjang Anda kosong.</p>";
            if (checkoutBtn) checkoutBtn.style.display = 'none';
        } else {
            cartItemsElement.innerHTML = '';
            if (checkoutBtn) checkoutBtn.style.display = 'block';
    
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <span>${item.name}</span>
                    <span class="harga">Rp ${item.price.toLocaleString()} x ${item.quantity}</span>
                    <div>
                        <button class="change-quantity" data-action="increase" data-name="${item.name}">+</button>
                        <button class="change-quantity" data-action="decrease" data-name="${item.name}">-</button>
                    </div>
                    <i class="fas fa-trash delete-icon" data-name="${item.name}"></i>
                `;
                cartItemsElement.appendChild(cartItemElement);
            });
        }
    
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toLocaleString();
    }
    

    cartItemsElement.addEventListener('click', function (event) {
        if (event.target.classList.contains('change-quantity')) {
            const action = event.target.getAttribute('data-action');
            const productName = event.target.getAttribute('data-name');
            changeQuantity(productName, action);
        } else if (event.target.classList.contains('delete-icon')) {
            const productName = event.target.getAttribute('data-name');
            removeItemFromCart(productName);
        }
    });

    function changeQuantity(name, action) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = cart.find(item => item.name === name);
        if (product) {
            if (action === 'increase') {
                product.quantity++;
            } else if (action === 'decrease' && product.quantity > 1) {
                product.quantity--;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }

    function removeItemFromCart(name) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.name !== name);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    document.querySelector('.cart-icon').addEventListener('click', function () {
        cartModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    window.onclick = function (event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    };

    document.getElementById('checkoutBtn').addEventListener('click', function () {
        window.location.href = 'checkout.html';
    });
});
