<?php
require_once "config/database.php";

class Product {
    private $conn;
    private $table_name = "products";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all products
    public function getAllProducts() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Get single product
    public function getProductById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt;
    }

    // Create product
    public function createProduct($name, $category, $price, $stock, $description, $image) {
        $query = "INSERT INTO " . $this->table_name . " (name, category, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$name, $category, $price, $stock, $description, $image]);
    }

    // Update product
    public function updateProduct($id, $name, $category, $price, $stock, $description, $image) {
        $query = "UPDATE " . $this->table_name . " SET name=?, category=?, price=?, stock=?, description=?, image=? WHERE id=?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$name, $category, $price, $stock, $description, $image, $id]);
    }

    // Delete product
    public function deleteProduct($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
