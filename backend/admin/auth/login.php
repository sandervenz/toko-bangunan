<?php
header("Access-Control-Allow-Origin: http://localhost:5500"); // sesuaikan dengan asal frontend
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if ($username === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Username dan password wajib diisi']);
        exit;
    }

    $query = "SELECT * FROM admin WHERE username = :username LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $admin = $stmt->fetch();

    if ($admin && hash('sha256', $password) === $admin['password']) {
        $_SESSION['admin'] = [
            'id' => $admin['id'],
            'username' => $admin['username']
        ];
        echo json_encode(['status' => 'success', 'message' => 'Login berhasil']);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Username atau password salah']);
    }
}
