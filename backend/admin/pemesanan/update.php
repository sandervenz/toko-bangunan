<?php
header("Access-Control-Allow-Origin: http://localhost:5500"); // sesuaikan dengan asal frontend
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';
// require_once '../auth/verify.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode tidak diizinkan']);
    exit;
}

// Ambil ID dari URL
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$orderId = is_numeric(end($path)) ? end($path) : null;

if (!$orderId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID pesanan tidak valid']);
    exit;
}

// Ambil data dari body (raw JSON)
$data = json_decode(file_get_contents("php://input"), true);
$status = isset($data['status']) ? $data['status'] : null;

// Validasi status
$allowedStatus = ['pending', 'completed', 'cancelled'];

if (!$status || !in_array($status, $allowedStatus)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Status tidak valid']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE orders SET status = :status WHERE id = :id");
    $stmt->execute([
        ':status' => $status,
        ':id' => $orderId
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Status pesanan berhasil diperbarui']);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Pesanan tidak ditemukan atau tidak ada perubahan']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui status', 'error' => $e->getMessage()]);
}
