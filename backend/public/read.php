<?php
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

try {
    $query = "SELECT 
                p.id, 
                p.name, 
                p.price, 
                p.stock, 
                p.description, 
                p.image,
                c.name AS category_name
              FROM products p
              JOIN categories c ON p.category_id = c.id";

    $stmt = $pdo->query($query);
    $products = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $products[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $products
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan: " . $e->getMessage()
    ]);
}
