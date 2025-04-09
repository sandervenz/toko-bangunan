<?php
header("Content-Type: application/json; charset=UTF-8");

require_once '../auth/verify.php';
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ambil ID dari path jika ada
    $uri = $_SERVER['REQUEST_URI'];
    $segments = explode('/', rtrim($uri, '/'));
    $id = is_numeric(end($segments)) ? end($segments) : null;

    if ($id) {
        // Ambil satu produk
        $query = "SELECT p.*, c.name AS category_name 
                  FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->execute([':id' => $id]);
        $produk = $stmt->fetch();

        if ($produk) {
            echo json_encode($produk);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Produk tidak ditemukan']);
        }
    } else {
        // Ambil semua produk
        $query = "SELECT p.*, c.name AS category_name 
                  FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  ORDER BY p.id DESC";
        $stmt = $pdo->query($query);
        $products = $stmt->fetchAll();
        echo json_encode($products);
    }
}
