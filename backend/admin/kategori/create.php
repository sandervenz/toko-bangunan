<?php
require_once '../auth/verify.php';
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $nama = $input['name'] ?? '';

    if ($nama === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Nama kategori wajib diisi']);
        exit;
    }

    $query = "INSERT INTO categories (name) VALUES (:name)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':name', $nama);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Kategori berhasil ditambahkan']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menambahkan kategori']);
    }
}
