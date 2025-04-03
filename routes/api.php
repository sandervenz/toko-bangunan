<?php
require_once "config/database.php";
require_once "controllers/AuthController.php";
require_once "middleware/AuthMiddleware.php";
require_once "controllers/ProductController.php";

header("Content-Type: application/json");

$database = new Database();
$db = $database->getConnection();

$authController = new AuthController($db);
$productController = new ProductController($db);

// Ambil URL dan hilangkan bagian "index.php"
$request_uri = str_replace("/tokoBangunan/index.php", "", $_SERVER["REQUEST_URI"]);
$uri = explode("/", trim($request_uri, "/"));

$endpoint = $uri[0] ?? "";
$id = $uri[1] ?? null;

// Routing API
if ($endpoint === "auth") {
    $request_method = $_SERVER["REQUEST_METHOD"];

    switch ($uri[1] ?? "") {
        case "login":
            if ($request_method === "POST") {
                $authController->login();
            }
            break;

        case "logout":
            if ($request_method === "POST") {
                $authController->logout();
            }
            break;

        case "check":
            if ($request_method === "GET") {
                $authController->checkSession();
            }
            break;

        default:
            echo json_encode(["message" => "Invalid auth endpoint"]);
            break;
    }
} elseif ($endpoint === "products") {
    AuthMiddleware::isAuthenticated(); // ⬅️ Proteksi API Produk

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
                echo json_encode(["message" => "Product ID is required"]);
            }
            break;

        case 'DELETE':
            if ($id) {
                $productController->deleteProduct($id);
            } else {
                echo json_encode(["message" => "Product ID is required"]);
            }
            break;

        default:
            echo json_encode(["message" => "Invalid request method"]);
            break;
    }
} else {
    echo json_encode(["message" => "Invalid API endpoint"]);
}
?>
