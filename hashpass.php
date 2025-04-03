<?php
$hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
echo "Hashed Password: " . $hashedPassword;
?>
