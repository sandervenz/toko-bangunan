// Data Dummy Produk
const products = [
    {
        id: 1,
        name: "Laptop Asus VivoBook",
        category: "Elektronik",
        price: 8500000,
        stock: 15,
        image: "https://via.placeholder.com/150?text=Laptop",
        description: "Laptop dengan performa tinggi untuk kebutuhan sehari-hari."
    },
    {
        id: 2,
        name: "Kemeja Pria Lengan Panjang",
        category: "Pakaian",
        price: 250000,
        stock: 50,
        image: "https://via.placeholder.com/150?text=Kemeja",
        description: "Kemeja formal untuk pria dengan bahan berkualitas."
    },
    {
        id: 3,
        name: "Coklat Premium",
        category: "Makanan",
        price: 75000,
        stock: 100,
        image: "https://via.placeholder.com/150?text=Coklat",
        description: "Coklat premium dengan rasa yang lezat."
    },
    {
        id: 4,
        name: "Smartphone Samsung Galaxy",
        category: "Elektronik",
        price: 3500000,
        stock: 25,
        image: "https://via.placeholder.com/150?text=Smartphone",
        description: "Smartphone dengan kamera berkualitas tinggi."
    },
    {
        id: 5,
        name: "Sepatu Olahraga",
        category: "Pakaian",
        price: 450000,
        stock: 30,
        image: "https://via.placeholder.com/150?text=Sepatu",
        description: "Sepatu olahraga dengan desain modern dan nyaman dipakai."
    }
];

// DOM Elements
const productsTable = document.getElementById('products-table').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const addProductBtn = document.getElementById('add-product-btn');
const productFormModal = document.getElementById('product-form-modal');
const deleteModal = document.getElementById('delete-modal');
const closeButtons = document.querySelectorAll('.close');
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');
const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productCategoryInput = document.getElementById('product-category');
const productPriceInput = document.getElementById('product-price');
const productStockInput = document.getElementById('product-stock');
const productImageUrlInput = document.getElementById('product-image-url');
const productDescriptionInput = document.getElementById('product-description');
const previewImg = document.getElementById('preview-img');
const cancelBtn = document.getElementById('cancel-btn');
const deleteProductName = document.getElementById('delete-product-name');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');

// Global Variables
let nextId = products.length + 1;
let productToDelete = null;

// Load products from localStorage or use dummy data
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        return JSON.parse(storedProducts);
    }
    // Save dummy data to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    return products;
}

// Save products to localStorage
function saveProducts(productsData) {
    localStorage.setItem('products', JSON.stringify(productsData));
}

// Render Products Table
function renderProductsTable(filteredProducts = loadProducts()) {
    productsTable.innerHTML = '';
    
    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
            <td>${product.stock}</td>
            <td class="action-buttons">
                <button class="btn-edit edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete delete-product" data-id="${product.id}" data-name="${product.name}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        productsTable.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', () => showEditProductForm(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', () => showDeleteModal(btn.getAttribute('data-id'), btn.getAttribute('data-name')));
    });
}

// Show Add Product Form
function showAddProductForm() {
    modalTitle.textContent = 'Tambah Produk';
    productForm.reset();
    productIdInput.value = '';
    previewImg.src = 'https://via.placeholder.com/150?text=Preview';
    
    productFormModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Show Edit Product Form
function showEditProductForm(productId) {
    const allProducts = loadProducts();
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;
    
    modalTitle.textContent = 'Edit Produk';
    productIdInput.value = product.id;
    productNameInput.value = product.name;
    productCategoryInput.value = product.category;
    productPriceInput.value = product.price;
    productStockInput.value = product.stock;
    productDescriptionInput.value = product.description || '';
    productImageUrlInput.value = product.image || '';
    previewImg.src = product.image || 'https://via.placeholder.com/150?text=Preview';
    
    productFormModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Show Delete Confirmation Modal
function showDeleteModal(productId, productName) {
    deleteProductName.textContent = productName;
    productToDelete = productId;
    deleteModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Modals
function closeModals() {
    productFormModal.style.display = 'none';
    deleteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle Image URL Change
function handleImageUrlChange() {
    const imageUrl = productImageUrlInput.value.trim();
    if (imageUrl) {
        previewImg.src = imageUrl;
    } else {
        previewImg.src = 'https://via.placeholder.com/150?text=Preview';
    }
}

// Handle Form Submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const allProducts = loadProducts();
    const productId = productIdInput.value ? parseInt(productIdInput.value) : nextId++;
    
    const productData = {
        id: productId,
        name: productNameInput.value,
        category: productCategoryInput.value,
        price: parseInt(productPriceInput.value),
        stock: parseInt(productStockInput.value),
        description: productDescriptionInput.value,
        image: productImageUrlInput.value || 'https://via.placeholder.com/150?text=No+Image'
    };
    
    if (productIdInput.value) {
        // Update existing product
        const index = allProducts.findIndex(p => p.id == productId);
        if (index !== -1) {
            allProducts[index] = productData;
        }
    } else {
        // Add new product
        allProducts.push(productData);
    }
    
    saveProducts(allProducts);
    renderProductsTable();
    closeModals();
}

// Delete Product
function deleteProduct() {
    if (!productToDelete) return;
    
    const allProducts = loadProducts();
    const updatedProducts = allProducts.filter(p => p.id != productToDelete);
    
    saveProducts(updatedProducts);
    renderProductsTable();
    closeModals();
}

// Filter Products
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    const allProducts = loadProducts();
    
    let filtered = allProducts;
    
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
    }
    
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    
    renderProductsTable(filtered);
}

// Event Listeners
addProductBtn.addEventListener('click', showAddProductForm);
closeButtons.forEach(btn => btn.addEventListener('click', closeModals));
cancelBtn.addEventListener('click', closeModals);
productForm.addEventListener('submit', handleFormSubmit);
productImageUrlInput.addEventListener('input', handleImageUrlChange);
searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
cancelDeleteBtn.addEventListener('click', closeModals);
confirmDeleteBtn.addEventListener('click', deleteProduct);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productFormModal || e.target === deleteModal) {
        closeModals();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProductsTable();
});

document.getElementById("order-link").addEventListener("click", function () {
    window.location.href = "home.html";
});

document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        const response = await fetch('http://localhost/tokoBangunan/backend/admin/auth/logout.php', {
            method: 'POST',
        });

        if (!response.ok) throw new Error('Logout gagal');

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Gagal logout:', error);
        alert('Gagal logout. Silakan coba lagi.');
    }
});