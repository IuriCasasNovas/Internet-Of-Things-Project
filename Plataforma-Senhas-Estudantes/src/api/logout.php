<?php
session_start();
session_destroy();
header('Content-Type: application/json');

echo json_encode([
    'message' => 'Logout bem-sucedido.',
    'redirectTo' => 'login.html'
]);
?>