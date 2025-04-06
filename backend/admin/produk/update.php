<?php
require_once '../auth/verify.php';
require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

// Ambil ID produk dari path URL
$id = basename($_SERVER['REQUEST_URI']);

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Validasi input awal
    if (
        empty($data['name']) ||
        empty($data['category_id']) ||
        empty($data['price']) ||
        empty($data['stock']) ||
        empty($data['description'])
    ) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi']);
        exit;
    }

    // Validasi kategori
    $cekKategori = $pdo->prepare("SELECT id FROM categories WHERE id = :id");
    $cekKategori->execute([':id' => $data['category_id']]);
    if (!$cekKategori->fetch()) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Kategori tidak ditemukan']);
        exit;
    }

    // Update data produk
    $query = "UPDATE products 
              SET name = :name, category_id = :category_id, price = :price,
                  stock = :stock, description = :description
              WHERE id = :id";
    $stmt = $pdo->prepare($query);

    try {
        $stmt->execute([
            ':name' => $data['name'],
            ':category_id' => $data['category_id'],
            ':price' => $data['price'],
            ':stock' => $data['stock'],
            ':description' => $data['description'],
            ':id' => $id
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Produk berhasil diperbarui']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
