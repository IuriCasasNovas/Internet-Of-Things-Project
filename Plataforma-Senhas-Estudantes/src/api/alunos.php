<?php
// api_alunos.php
header('Content-Type: application/json');
include 'db.php';

$sql = "
    SELECT
        A.Id_Aluno,
        P.Nome,
        A.Numero_Aluno,
        A.Estado,
        (
            SELECT COUNT(S.Id_Senha)
            FROM Senha S
            JOIN Compra C ON S.Compra = C.Id_Compra
            WHERE C.Aluno = A.Id_Aluno
            -- Podes ajustar a condição 'Estado = 1' dependendo de qual ID de estado significa 'Ativa' na tua tabela Estado.
            AND S.Estado = (SELECT Id_Estado FROM Estado WHERE Estado = 'Emitida')
        ) AS Total_Senhas
    FROM
        Aluno A
    JOIN
        Pessoa P ON A.Pessoa = P.Id_Pessoa
    ORDER BY P.Nome ASC
";

$result = $conn->query($sql);

$alunos = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $alunos[] = $row;
    }
}

echo json_encode($alunos);
$conn->close();
?>