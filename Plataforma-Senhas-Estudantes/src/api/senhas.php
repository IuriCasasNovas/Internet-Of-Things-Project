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
            JOIN Estado AS e ON s.Estado = e.Id_Estado 
            JOIN Compra AS c ON s.Compra = c.Id_Compra 
            JOIN Aluno AS a ON c.Aluno = a.Id_Aluno 
            WHERE a.Pessoa = ? AND e.Estado = 'Ativo'";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$pessoaId]);
    $result = $stmt->fetch();

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erro ao buscar senhas.']);
}
?>