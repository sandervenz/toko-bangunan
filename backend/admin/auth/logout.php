<?php
header("Access-Control-Allow-Origin: *");

session_start();
session_destroy();

echo json_encode(['status' => 'success', 'message' => 'Logout berhasil']);
