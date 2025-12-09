<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'aluno') {
    http_response_code(403);
    echo json_encode(['message' => 'Acesso negado.']);
    exit;
}

try {
    $pessoaId = $_SESSION['user']['id'];
    
    $sql = "SELECT COUNT(s.Id_Senha) AS quantidade
            FROM Senha AS s
            JOIN Estado_Senha AS es ON s.Estado_Senha = es.Id_Estado_Senha
            JOIN Compra AS c ON s.Compra = c.Id_Compra
            JOIN Aluno AS a ON c.Aluno = a.Id_Aluno
            WHERE a.Pessoa = ? AND es.Estado = 'Disponivel'";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$pessoaId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erro ao buscar senhas.'], JSON_UNESCAPED_UNICODE);
}
?>
