<?php
header('Content-Type: application/json; charset=utf-8');

require 'db.php'; 

if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha na conexão: variavel pdo não encontrada."]);
    exit;
}

try {
    $busca = isset($_GET['busca']) ? $_GET['busca'] : null;

    $sql = "
        SELECT 
            A.Id_Aluno,
            P.Nome_Pessoa,
            P.Foto_Pessoa,
            A.Numero_Aluno,
            A.Curso_Aluno,
            E.Estado AS estado_cartao, -- Alias alterado para corresponder ao teu JS
            (
                SELECT COUNT(S.Id_Senha) 
                FROM Compra C
                JOIN Senha S ON S.Compra = C.Id_Compra
                JOIN Estado_Senha ES ON S.Estado_Senha = ES.Id_Estado_Senha
                WHERE C.Aluno = A.Id_Aluno AND ES.Estado = 'Disponivel'
            ) AS Total_Senhas
        FROM Aluno A
        JOIN Pessoa P ON A.Pessoa = P.Id_Pessoa
        JOIN Estado_Cartao E ON A.Estado_Cartao = E.Id_Estado_Cartao -- Tabela e coluna atualizadas
    ";

    if ($busca) {
        $sql .= " WHERE P.Nome_Pessoa LIKE :buscaNome OR A.Numero_Aluno LIKE :buscaNumero";
    }

    $sql .= " ORDER BY P.Nome_Pessoa ASC";

    $stmt = $pdo->prepare($sql);

    if ($busca) {
        $termo = "%" . $busca . "%";
        $stmt->bindValue(':buscaNome', $termo);
        $stmt->bindValue(':buscaNumero', $termo);
    }

    $stmt->execute();
    
    $alunos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($alunos);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro na query: " . $e->getMessage()]);
}
?>