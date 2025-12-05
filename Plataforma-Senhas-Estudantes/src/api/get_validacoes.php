<?php
header('Content-Type: application/json; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "inforSenhasIuri";

// Conexão mysqli com charset
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["error" => "Erro ao conectar: " . $conn->connect_error]);
    exit();
}

$sql = "
    SELECT 
        p.Nome_Pessoa,
        a.Numero_Aluno,
        v.Resultado_Validacao,
        v.Data_Hora_Validacao
    FROM Validacao v
    JOIN Aluno a ON v.Aluno = a.Id_Aluno
    JOIN Pessoa p ON a.Pessoa = p.Id_Pessoa
    ORDER BY v.Data_Hora_Validacao DESC
    LIMIT 50
";

$result = $conn->query($sql);

$dados = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dados[] = [
            "Nome" => $row["Nome_Pessoa"],
            "Numero_Aluno" => $row["Numero_Aluno"],
            "Resultado" => $row["Resultado_Validacao"],
            "Data_Hora" => $row["Data_Hora_Validacao"]
        ];
    }
}

$conn->close();

echo json_encode($dados, JSON_UNESCAPED_UNICODE);
?>
