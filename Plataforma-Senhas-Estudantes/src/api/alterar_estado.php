<?php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$idAluno = $input['id'] ?? null;
$estadoStringAtual = $input['estado'] ?? null;

if (!$idAluno || !$estadoStringAtual) {
    echo json_encode(['sucesso' => false, 'erro' => 'Dados em falta']);
    exit;
}

try {
    
    $stmtEstados = $pdo->prepare("SELECT Id_Estado_Cartao, Estado FROM Estado_Cartao WHERE Estado IN ('Ativo', 'Inativo')");
    $stmtEstados->execute();
    $estados = $stmtEstados->fetchAll(PDO::FETCH_KEY_PAIR);

    $idAtivo = $estados['Ativo'] ?? 1;
    $idInativo = $estados['Inativo'] ?? 2;

    if ($estadoStringAtual === 'Ativo') {
        $novoIdEstado = $idInativo;
        $novoTextoEstado = 'Inativo';
    } else {
        $novoIdEstado = $idAtivo;
        $novoTextoEstado = 'Ativo';
    }
    $sql = "UPDATE Aluno SET Estado_Cartao = :novoIdEstado WHERE Id_Aluno = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':novoIdEstado', $novoIdEstado, PDO::PARAM_INT);
    $stmt->bindParam(':id', $idAluno, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['sucesso' => true, 'novo_estado' => $novoTextoEstado]);

} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>