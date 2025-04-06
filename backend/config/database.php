<?php
// Konfigurasi database
$host = 'localhost';
$db   = 'toko_bangunan'; 
$user = 'root';           
$pass = '';              

try {
    // Buat koneksi PDO
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);

    // Set mode error menjadi Exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Aktifkan fetch associative secara default
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Jika gagal koneksi, hentikan program dan tampilkan pesan error
    die("Koneksi ke database gagal: " . $e->getMessage());
}
?>
