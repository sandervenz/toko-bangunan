<?php
require_once "models/Product.php";

class ProductController {
    private $product;

    public function __construct($db) {
        $this->product = new Product($db);
    }

    public function getAllProducts() {
        $stmt = $this->product->getAllProducts();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    }

    public function getProductById($id) {
        $stmt = $this->product->getProductById($id);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($result ?: ["message" => "Product not found"]);
    }

    public function createProduct() {
        $data = json_decode(file_get_contents("php://input"), true);

        // Cek apakah field yang wajib ada (selain image)
        if (!isset($data['name'], $data['category'], $data['price'], $data['stock'], $data['description'])) {
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }

        // Jika image tidak ada, set ke null atau default
        $image = $data['image'] ?? null;

        if ($this->product->createProduct($data['name'], $data['category'], $data['price'], $data['stock'], $data['description'], $image)) {
            echo json_encode(["message" => "Product created successfully"]);
        } else {
            echo json_encode(["message" => "Failed to create product"]);
        }
    }

    public function updateProduct($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        // Cek apakah field wajib ada (selain image)
        if (!isset($data['name'], $data['category'], $data['price'], $data['stock'], $data['description'])) {
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }

        // Jika image tidak ada dalam request, jangan update field image
        $image = $data['image'] ?? null;

        if ($this->product->updateProduct($id, $data['name'], $data['category'], $data['price'], $data['stock'], $data['description'], $image)) {
            echo json_encode(["message" => "Product updated successfully"]);
        } else {
            echo json_encode(["message" => "Failed to update product"]);
        }
    }

    public function deleteProduct($id) {
        if ($this->product->deleteProduct($id)) {
            echo json_encode(["message" => "Product deleted successfully"]);
        } else {
            echo json_encode(["message" => "Failed to delete product"]);
        }
    }
}
?>
