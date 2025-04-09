<?php
header("Content-Type: application/json; charset=UTF-8");

require_once '../auth/verify.php';
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM categories ORDER BY id DESC";
    $stmt = $pdo->query($query);
    $kategori = $stmt->fetchAll();

    echo json_encode($kategori);
}
