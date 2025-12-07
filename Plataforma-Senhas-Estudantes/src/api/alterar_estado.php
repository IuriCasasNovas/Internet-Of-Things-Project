<?php
header('Content-Type: application/json');
require 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$idAluno = $input['id'] ?? null;
$estadoAtual = $input['estado'] ?? null;

if (!$idAluno || !$estadoAtual) {
    echo json_encode(['sucesso' => false, 'erro' => 'Dados em falta']);
    exit;
}

// Converter texto → ID do estado
if ($estadoAtual === 'Ativo') {
    $novoEstadoTexto = 'Inativo';
} else {
    $novoEstadoTexto = 'Ativo';
}

// Obter ID do novo estado
$stmt = $pdo->prepare("SELECT Id_Estado FROM Estado WHERE Estado = ?");
$stmt->execute([$novoEstadoTexto]);
$novoEstadoId = $stmt->fetchColumn();

if (!$novoEstadoId) {
    echo json_encode(['sucesso' => false, 'erro' => 'Estado inválido']);
    exit;
}

try {
    $sql = "UPDATE Aluno SET Estado = :novoEstado WHERE Id_Aluno = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':novoEstado', $novoEstadoId, PDO::PARAM_INT);
    $stmt->bindParam(':id', $idAluno, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        'sucesso' => true,
        'novo_estado' => $novoEstadoTexto
    ]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
