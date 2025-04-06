<?php
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
