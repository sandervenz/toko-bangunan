<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../auth/verify.php';
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $uri = $_SERVER['REQUEST_URI'];
    $segments = explode('/', rtrim($uri, '/'));
    $id = end($segments);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID produk wajib diisi']);
        exit;
    }

    $query = "DELETE FROM products WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->execute([':id' => $id]);

    echo json_encode(['status' => 'success', 'message' => 'Produk berhasil dihapus']);
}
