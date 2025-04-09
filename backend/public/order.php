<?php
require_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode tidak diizinkan']);
    exit;
}

// Validasi input utama
if (
    empty($data['name']) ||
    empty($data['email']) ||
    empty($data['phone']) ||
    empty($data['address']) ||
    !isset($data['items']) || !is_array($data['items']) || count($data['items']) === 0
) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Simpan order ke tabel orders
    $orderStmt = $pdo->prepare("
        INSERT INTO orders (name, email, phone, address, total_price) 
        VALUES (:name, :email, :phone, :address, 0)
    ");
    $orderStmt->execute([
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':phone' => $data['phone'],
        ':address' => $data['address']
    ]);
    $orderId = $pdo->lastInsertId();

    $totalPrice = 0;

    // Proses setiap item
    foreach ($data['items'] as $item) {
        $productId = $item['product_id'];
        $quantity = $item['quantity'];

        // Ambil data produk
        $productStmt = $pdo->prepare("SELECT price, stock FROM products WHERE id = :id");
        $productStmt->execute([':id' => $productId]);
        $product = $productStmt->fetch();

        if (!$product) {
            throw new Exception("Produk dengan ID $productId tidak ditemukan");
        }

        if ($product['stock'] < $quantity) {
            throw new Exception("Stok tidak cukup untuk produk ID $productId");
        }

        $price = $product['price'];
        $subtotal = $price * $quantity;
        $totalPrice += $subtotal;

        // Simpan ke order_items
        $itemStmt = $pdo->prepare("
            INSERT INTO order_items (order_id, product_id, quantity, price) 
            VALUES (:order_id, :product_id, :quantity, :price)
        ");
        $itemStmt->execute([
            ':order_id' => $orderId,
            ':product_id' => $productId,
            ':quantity' => $quantity,
            ':price' => $price
        ]);

        // Kurangi stok produk
        $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - :qty WHERE id = :id");
        $updateStockStmt->execute([
            ':qty' => $quantity,
            ':id' => $productId
        ]);
    }

    // Update total harga di tabel orders
    $updateOrder = $pdo->prepare("UPDATE orders SET total_price = :total WHERE id = :id");
    $updateOrder->execute([
        ':total' => $totalPrice,
        ':id' => $orderId
    ]);

    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Pesanan berhasil dibuat', 'order_id' => $orderId]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
