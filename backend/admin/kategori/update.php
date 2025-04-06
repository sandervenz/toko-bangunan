<?php
require_once '../auth/verify.php';
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Ambil ID dari URI
    $uri = $_SERVER['REQUEST_URI'];
    $segments = explode('/', rtrim($uri, '/'));
    $id = end($segments);

    // Ambil data dari body
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? '';

    if ($name === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Nama wajib diisi']);
        exit;
    }

    $query = "UPDATE categories SET name = :name WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Kategori berhasil diubah']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengubah kategori']);
    }
}
