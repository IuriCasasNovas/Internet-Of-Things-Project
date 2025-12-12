<?php
header('Content-Type: application/json; charset=utf-8');
require 'db.php';

try {
    $mes = $_GET['mes'] ?? null;
    $ano = $_GET['ano'] ?? null;

    $condicao = "1=1";
    $params = [];

    if ($mes && $mes !== '') {
        $condicao .= " AND MONTH(C.Data_Hora_Compra) = :mes";
        $params[':mes'] = $mes;
    }
    if ($ano && $ano !== '') {
        $condicao .= " AND YEAR(C.Data_Hora_Compra) = :ano";
        $params[':ano'] = $ano;
    }

    $sqlResumo = "SELECT SUM(Valor_Total_Compra) FROM Compra C WHERE $condicao";
    $stmt = $pdo->prepare($sqlResumo);
    $stmt->execute($params);
    $receita = $stmt->fetchColumn() ?: 0;

    $sqlQtd = "SELECT COUNT(S.Id_Senha) 
               FROM Senha S 
               JOIN Compra C ON S.Compra = C.Id_Compra 
               WHERE $condicao";
    $stmt = $pdo->prepare($sqlQtd);
    $stmt->execute($params);
    $qtd = $stmt->fetchColumn() ?: 0;

    $sqlHist = "
        SELECT 
            C.Id_Compra, 
            C.Data_Hora_Compra, 
            C.Valor_Total_Compra, 
            P.Nome_Pessoa, 
            A.Numero_Aluno,
            (SELECT COUNT(*) FROM Senha S WHERE S.Compra = C.Id_Compra) as qtd_senhas
        FROM Compra C
        JOIN Aluno A ON C.Aluno = A.Id_Aluno
        JOIN Pessoa P ON A.Pessoa = P.Id_Pessoa
        WHERE $condicao
        ORDER BY C.Data_Hora_Compra DESC 
        LIMIT 50
    ";
    $stmt = $pdo->prepare($sqlHist);
    $stmt->execute($params);
    $historico = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'sucesso' => true,
        'resumo' => [
            'receita_total' => $receita, 
            'total_senhas_vendidas' => $qtd
        ],
        'historico' => $historico
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>