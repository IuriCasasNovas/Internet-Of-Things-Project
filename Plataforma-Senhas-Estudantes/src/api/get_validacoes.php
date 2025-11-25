<?php
header('Content-Type: application/json; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "inforSenhas";

// Conexão
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Erro ao conectar: " . $conn->connect_error]);
    exit();
}

// Query para Validacao
$sql = "
    SELECT 
        p.Nome,
        a.Numero_Aluno,
        v.Resultado,
        v.Data_Hora
    FROM Validacao v
    JOIN Aluno a ON v.Aluno = a.Id_Aluno
    JOIN Pessoa p ON a.Pessoa = p.Id_Pessoa
    ORDER BY v.Data_Hora DESC
    LIMIT 50
";

$result = $conn->query($sql);

$dados = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dados[] = [
            "Nome" => $row["Nome"],
            "Numero_Aluno" => $row["Numero_Aluno"],
            "Resultado" => $row["Resultado"],
            "Data_Hora" => $row["Data_Hora"]
        ];
    }
}

$conn->close();

echo json_encode($dados, JSON_UNESCAPED_UNICODE);
?>
