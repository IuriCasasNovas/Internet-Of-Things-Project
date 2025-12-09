<?php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$idAluno = $input['id_aluno'] ?? null;
$quantidade = $input['quantidade'] ?? 0;
$precoUnitario = 2.90;

if (!$idAluno || $quantidade <= 0) {
    echo json_encode(['sucesso' => false, 'erro' => 'Dados inválidos']);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmtEstado = $pdo->prepare("SELECT Id_Estado_Senha FROM Estado_Senha WHERE Estado = 'Disponivel' LIMIT 1");
    $stmtEstado->execute();
    $estado = $stmtEstado->fetch(PDO::FETCH_ASSOC);
    $idEstadoSenha = $estado['Id_Estado_Senha'] ?? 1;

    $valorTotal = $quantidade * $precoUnitario;
    $sqlCompra = "INSERT INTO Compra (Aluno, Valor_Total_Compra, Metodo_Pagamento_Compra, Data_Hora_Compra) 
                  VALUES (:aluno, :valor, 'Numerário', NOW())";
    $stmtCompra = $pdo->prepare($sqlCompra);
    $stmtCompra->execute([':aluno' => $idAluno, ':valor' => $valorTotal]);
    
    $idCompra = $pdo->lastInsertId(); 

    $sqlSenha = "INSERT INTO Senha (Compra, Estado_Senha, Preco_Senha, Data_Validade_Senha) 
                  VALUES (:compra, :estado, :preco, :validade)";
    $stmtSenha = $pdo->prepare($sqlSenha);

    $validade = date('Y-m-d H:i:s', strtotime('+1 year'));

    for ($i = 0; $i < $quantidade; $i++) {
        $stmtSenha->execute([
            ':compra' => $idCompra,
            ':estado' => $idEstadoSenha,
            ':preco'  => $precoUnitario,
            ':validade' => $validade
        ]);
    }

    $pdo->commit();

    echo json_encode(['sucesso' => true, 'mensagem' => "$quantidade senhas adicionadas!"]);

} catch (Exception $e) {
    $pdo->rollBack(); 
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>