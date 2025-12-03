<?php
header('Content-Type: application/json');
require 'db.php';

// Receber os dados enviados pelo JS (JSON)
$input = json_decode(file_get_contents('php://input'), true);
$idAluno = $input['id'] ?? null;
$estadoAtual = $input['estado'] ?? null;

if (!$idAluno || !$estadoAtual) {
    echo json_encode(['sucesso' => false, 'erro' => 'Dados em falta']);
    exit;
}

$novoEstado = ($estadoAtual === 'Ativo') ? 'Inativo' : 'Ativo';

try {
    $sql = "UPDATE Aluno SET Estado = :novoEstado WHERE Id_Aluno = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':novoEstado', $novoEstado);
    $stmt->bindParam(':id', $idAluno);
    $stmt->execute();

    echo json_encode(['sucesso' => true, 'novo_estado' => $novoEstado]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>