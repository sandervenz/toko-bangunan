document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "http://localhost/tokoBangunan/backend/admin";
    const productTableBody = document.querySelector("#products-table tbody");
    const categoryFilter = document.getElementById("category-filter");
    const productCategorySelect = document.getElementById("product-category");
    const logoutBtn = document.getElementById("logout-btn");

    let kategoriMap = {};

    // Logout
    logoutBtn.addEventListener("click", () => {
        fetch(`${API_BASE}/auth/logout.php`, {
            method: "POST",
            credentials: "include",
        }).then(() => {
            window.location.href = "login.html";
        });
    });

    // Load kategori ke filter dan form
    function loadCategories() {
        fetch(`${API_BASE}/kategori/read.php`, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                kategoriMap = {};
                categoryFilter.innerHTML = `<option value="">Semua Kategori</option>`;
                productCategorySelect.innerHTML = `<option value="">Pilih Kategori</option>`;
                data.forEach(kategori => {
                    kategoriMap[kategori.id] = kategori.name;
                    const option = `<option value="${kategori.id}">${kategori.name}</option>`;
                    categoryFilter.insertAdjacentHTML("beforeend", option);
                    productCategorySelect.insertAdjacentHTML("beforeend", option);
                });
            });
    }

    // Load produk
    function loadProducts() {
        fetch(`${API_BASE}/produk/read.php`, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => renderProducts(data));
    }

    // Render produk ke tabel
    function renderProducts(products) {
        const searchTerm = document.getElementById("search").value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filtered = products.filter(p => {
            const matchName = p.name.toLowerCase().includes(searchTerm);
            const matchCategory = selectedCategory === "" || p.category_id == selectedCategory;
            return matchName && matchCategory;
        });

        productTableBody.innerHTML = "";
        filtered.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>${kategoriMap[product.category_id] || "Tidak Diketahui"}</td>
                <td>Rp ${parseInt(product.price).toLocaleString()}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-edit edit-product" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete delete-product" data-id="${product.id}" data-name="${product.name}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    }

    // Filter dan search
    document.getElementById("search").addEventListener("input", loadProducts);
    categoryFilter.addEventListener("change", loadProducts);

    // Gambar preview
    document.getElementById("product-image-url").addEventListener("input", (e) => {
        document.getElementById("preview-img").src = e.target.value || "https://via.placeholder.com/150?text=Preview";
    });

    // Modal logic
    const modal = document.getElementById("product-form-modal");
    const deleteModal = document.getElementById("delete-modal");
    const form = document.getElementById("product-form");
    const modalTitle = document.getElementById("modal-title");
    const addBtn = document.getElementById("add-product-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const closeBtns = document.querySelectorAll(".modal .close");

    addBtn.onclick = () => {
        modalTitle.textContent = "Tambah Produk";
        form.reset();
        document.getElementById("product-id").value = "";
        document.getElementById("preview-img").src = "https://via.placeholder.com/150?text=Preview";
        modal.style.display = "block";
    };

    cancelBtn.onclick = () => modal.style.display = "none";
    closeBtns.forEach(btn => btn.onclick = () => btn.closest(".modal").style.display = "none");

    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = "none";
        if (e.target == deleteModal) deleteModal.style.display = "none";
    };

    // Simpan produk
    form.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById("product-id").value;
        const data = {
            name: document.getElementById("product-name").value,
            category_id: parseInt(document.getElementById("product-category").value),
            price: parseInt(document.getElementById("product-price").value),
            stock: parseInt(document.getElementById("product-stock").value),
            image: document.getElementById("product-image-url").value,
            description: document.getElementById("product-description").value
        };
        if (id) data.id = parseInt(id);

        const endpoint = id ? `update.php/${id}` : "create.php";
        const method = id ? "PUT" : "POST";

        fetch(`${API_BASE}/produk/${endpoint}`, {
            method: method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(() => {
                modal.style.display = "none";
                loadProducts();
            });
    };

    // Edit produk
    productTableBody.addEventListener("click", (e) => {
        if (e.target.closest(".edit-product")) {
            const id = e.target.closest(".edit-product").dataset.id;
            fetch(`${API_BASE}/produk/read.php/${id}`, {
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    modalTitle.textContent = "Edit Produk";
                    document.getElementById("product-id").value = data.id;
                    document.getElementById("product-name").value = data.name;
                    document.getElementById("product-category").value = data.category_id;
                    document.getElementById("product-price").value = data.price;
                    document.getElementById("product-stock").value = data.stock;
                    document.getElementById("product-image-url").value = data.image;
                    document.getElementById("product-description").value = data.description;
                    document.getElementById("preview-img").src = data.image;
                    modal.style.display = "block";
                });
        }

        // Hapus produk
        if (e.target.closest(".delete-product")) {
            const id = e.target.closest(".delete-product").dataset.id;
            const name = e.target.closest(".delete-product").dataset.name;
            document.getElementById("delete-product-name").textContent = name;
            deleteModal.style.display = "block";

            document.getElementById("confirm-delete").onclick = () => {
                fetch(`${API_BASE}/produk/delete.php/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                })
                    .then(res => res.json())
                    .then(() => {
                        deleteModal.style.display = "none";
                        loadProducts();
                    })
                    .catch(err => console.error("Delete error:", err));
                
            };

            document.getElementById("cancel-delete").onclick = () => {
                deleteModal.style.display = "none";
            };
        }
    });

    // Init
    loadCategories();
    loadProducts();
});
