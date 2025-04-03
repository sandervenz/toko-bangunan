<?php
require_once "models/User.php";

class AuthController {
    private $user;

    public function __construct($db) {
        $this->user = new User($db);
    }

    public function login() {
        session_start();
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['username'], $data['password'])) {
            echo json_encode(["message" => "Username dan password wajib diisi"]);
            return;
        }

        $user = $this->user->login($data['username'], $data['password']);

        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            echo json_encode(["message" => "Login berhasil"]);
        } else {
            echo json_encode(["message" => "Username atau password salah"]);
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(["message" => "Logout berhasil"]);
    }

    public function checkSession() {
        session_start();
        if (isset($_SESSION['user_id'])) {
            echo json_encode(["logged_in" => true, "username" => $_SESSION['username']]);
        } else {
            echo json_encode(["logged_in" => false]);
        }
    }
}
?>
