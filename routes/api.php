<?php
require_once "config/database.php";
require_once "controllers/ProductController.php";

header("Content-Type: application/json");

$database = new Database();
$db = $database->getConnection();
$productController = new ProductController($db);

// Ambil URL dan hilangkan bagian "index.php"
$request_uri = str_replace("/tokoBangunan/index.php", "", $_SERVER["REQUEST_URI"]);
$uri = explode("/", trim($request_uri, "/"));

$endpoint = $uri[0] ?? "";
$id = $uri[1] ?? null; // Ambil ID dari path jika ada

if ($endpoint === "" || $endpoint === "index.php") {
    echo json_encode(["message" => "Welcome to Toko Bangunan API"]);
} elseif ($endpoint === "products") {
    $request_method = $_SERVER["REQUEST_METHOD"];

    switch ($request_method) {
        case 'GET':
            if ($id) {
                $productController->getProductById($id);
            } else {
                $productController->getAllProducts();
            }
            break;

        case 'POST':
            $productController->createProduct();
            break;

        case 'PUT':
            if ($id) {
                $productController->updateProduct($id);
            } else {
                echo json_encode(["message" => "Product ID is required in the URL"]);
            }
            break;

        case 'DELETE':
            if ($id) {
                $productController->deleteProduct($id);
            } else {
                echo json_encode(["message" => "Product ID is required in the URL"]);
            }
            break;

        default:
            echo json_encode(["message" => "Invalid request method"]);
            break;
    }
} else {
    echo json_encode(["message" => "Invalid API endpoint"]);
}
