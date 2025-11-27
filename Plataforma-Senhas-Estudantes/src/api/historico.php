<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

ini_set('display_errors', 0);
ini_set('log_errors', 1);

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'aluno') {
    http_response_code(403);
    echo json_encode(['message' => 'Acesso negado.']);
    exit;
}

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;
$limit = 5;
$offset = ($page - 1) * $limit;

try {
    $stmtAluno = $pdo->prepare("SELECT Id_Aluno FROM Aluno WHERE Pessoa = ?");
    $stmtAluno->execute([$_SESSION['user']['id']]);
    $idAluno = $stmtAluno->fetchColumn();

    $check = $pdo->query("SHOW COLUMNS FROM Compra LIKE 'Data_Hora_Compra'");
    $usaNomesNovos = ($check->fetch());

    if ($usaNomesNovos) {
        $colData = "Data_Hora_Compra";
        $colValor = "Valor_Total_Compra";
        $colMetodo = "Metodo_Pagamento_Compra";
    } else {
        $colData = "Data_Hora";
        $colValor = "Valor_Total";
        $colMetodo = "Metodo_Pagamento";
    }
    
    $sql = "
        SELECT 
            c.$colData as DataHora, 
            c.$colValor as Valor, 
            c.$colMetodo as Metodo, 
            COUNT(s.Id_Senha) as Quantidade
        FROM Compra c
        LEFT JOIN Senha s ON c.Id_Compra = s.Compra
        WHERE c.Aluno = :idAluno  /* MUDÁMOS DE ? PARA :idAluno */
        GROUP BY c.Id_Compra
        ORDER BY c.$colData DESC
        LIMIT :limite OFFSET :offset
    ";

    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(':idAluno', $idAluno, PDO::PARAM_INT);
    $stmt->bindValue(':limite', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $compras = $stmt->fetchAll();

    $historico = [];
    foreach ($compras as $compra) {
        $historico[] = [
            'data' => date('d/m/Y H:i', strtotime($compra['DataHora'])),
            'quantidade' => $compra['Quantidade'],
            'preco' => number_format($compra['Valor'], 2) . '€',
            'metodo' => $compra['Metodo']
        ];
    }

    $stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM Compra WHERE Aluno = ?");
    $stmtTotal->execute([$idAluno]);
    $totalRegistos = $stmtTotal->fetchColumn();
    $totalPaginas = ceil($totalRegistos / $limit);

    echo json_encode([
        'data' => $historico,
        'pagina_atual' => $page,
        'total_paginas' => $totalPaginas
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erro SQL: ' . $e->getMessage()]);
}
?>