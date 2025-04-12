<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';
require_once '../auth/verify.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode tidak diizinkan']);
    exit;
}

// Ambil bagian akhir dari URL (mungkin ID)
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$orderId = is_numeric(end($path)) ? end($path) : null;

try {
    // Jika ada ID → tampilkan 1 pesanan
    if ($orderId) {
        $orderStmt = $pdo->prepare("SELECT * FROM orders WHERE id = :id");
        $orderStmt->execute([':id' => $orderId]);
        $order = $orderStmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Pesanan tidak ditemukan']);
            exit;
        }

        $itemsStmt = $pdo->prepare("
            SELECT oi.*, p.name AS product_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = :order_id
        ");
        $itemsStmt->execute([':order_id' => $orderId]);
        $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($items as &$item) {
            $item['subtotal'] = $item['price'] * $item['quantity'];
        }

        $response = [
            'order_id' => $order['id'],
            'name' => $order['name'],
            'email' => $order['email'],
            'phone' => $order['phone'],
            'address' => $order['address'],
            'status' => $order['status'],
            'total_price' => $order['total_price'],
            'created_at' => $order['created_at'],
            'items' => $items
        ];

        echo json_encode(['status' => 'success', 'data' => $response]);
        exit;
    }

    // Jika tidak ada ID → tampilkan semua pesanan
    $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];

    foreach ($orders as $order) {
        $result[] = [
            'order_id' => $order['id'],
            'name' => $order['name'],
            'email' => $order['email'],
            'phone' => $order['phone'],
            'address' => $order['address'],
            'status' => $order['status'],
            'total_price' => $order['total_price'],
            'created_at' => $order['created_at']
        ];
    }

    echo json_encode(['status' => 'success', 'data' => $result]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan', 'error' => $e->getMessage()]);
}
