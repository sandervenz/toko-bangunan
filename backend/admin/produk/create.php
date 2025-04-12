<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../auth/verify.php';
require_once '../../config/database.php';

// Ambil data JSON dari body request
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validasi input awal
    if (
        empty($data['name']) ||
        empty($data['category_id']) ||
        empty($data['price']) ||
        empty($data['stock']) ||
        empty($data['description']) ||
        empty($data['image'])
    ) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi']);
        exit;
    }

    // Cek apakah category_id valid
    $cekKategori = $pdo->prepare("SELECT id FROM categories WHERE id = :id");
    $cekKategori->execute([':id' => $data['category_id']]);
    if (!$cekKategori->fetch()) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Kategori tidak ditemukan']);
        exit;
    }

    $query = "INSERT INTO products (name, category_id, price, stock, description, image) 
              VALUES (:name, :category_id, :price, :stock, :description, :image)";
    $stmt = $pdo->prepare($query);
    try {
        $stmt->execute([
            ':name' => $data['name'],
            ':category_id' => $data['category_id'],
            ':price' => $data['price'],
            ':stock' => $data['stock'],
            ':description' => $data['description'],
            ':image' => $data['image']
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Produk berhasil ditambahkan']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
