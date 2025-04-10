<?php
header("Access-Control-Allow-Origin: *");
require_once '../config/database.php';
require_once '../libs/fpdf.php';

// Ambil ID dari URL
$path = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$orderId = is_numeric(end($path)) ? end($path) : null;

if (!$orderId) {
    http_response_code(400);
    echo "ID pesanan tidak valid";
    exit;
}

// Ambil data pesanan
$stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->execute([$orderId]);
$order = $stmt->fetch();

if (!$order) {
    http_response_code(404);
    echo "Pesanan tidak ditemukan";
    exit;
}

// Ambil item pesanan
$itemStmt = $pdo->prepare("
    SELECT p.name, oi.quantity, oi.price
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
");
$itemStmt->execute([$orderId]);
$items = $itemStmt->fetchAll();

// Mulai buat PDF
$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 14);
$pdf->Cell(0, 10, 'Struk Pesanan - Toko Era Bangunan', 0, 1, 'C');
$pdf->Ln(5);

$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 10, "Order ID: " . $order['id'], 0, 1);
$pdf->Cell(0, 10, "Nama: " . $order['name'], 0, 1);
$pdf->Cell(0, 10, "Email: " . $order['email'], 0, 1);
$pdf->Cell(0, 10, "No Telp: " . $order['phone'], 0, 1);
$pdf->MultiCell(0, 10, "Alamat: " . $order['address']);
$pdf->Cell(0, 10, "Tanggal: " . $order['created_at'], 0, 1);
$pdf->Ln(5);

$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(80, 10, 'Produk', 1);
$pdf->Cell(30, 10, 'Jumlah', 1);
$pdf->Cell(40, 10, 'Harga Satuan', 1);
$pdf->Cell(40, 10, 'Subtotal', 1);
$pdf->Ln();

$pdf->SetFont('Arial', '', 12);
$total = 0;
foreach ($items as $item) {
    $subtotal = $item['quantity'] * $item['price'];
    $total += $subtotal;

    $pdf->Cell(80, 10, $item['name'], 1);
    $pdf->Cell(30, 10, $item['quantity'], 1, 0, 'C');
    $pdf->Cell(40, 10, 'Rp ' . number_format($item['price'], 0, ',', '.'), 1);
    $pdf->Cell(40, 10, 'Rp ' . number_format($subtotal, 0, ',', '.'), 1);
    $pdf->Ln();
}

$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(150, 10, 'Total Harga', 1);
$pdf->Cell(40, 10, 'Rp ' . number_format($total, 0, ',', '.'), 1);
$pdf->Ln(10);

$pdf->SetFont('Arial', 'I', 10);
$pdf->Cell(0, 10, 'Terima kasih telah berbelanja di Toko Era Bangunan!', 0, 1, 'C');

// Output PDF
$pdf->Output("I", "struk_pesanan_{$orderId}.pdf");
