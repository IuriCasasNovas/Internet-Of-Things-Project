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
    v.Id_Validacao,
    p.Nome_Pessoa,
    a.Numero_Aluno,
    v.Senha,
    v.Resultado_Validacao,
    v.Data_Hora_Validacao
FROM Validacao v
LEFT JOIN Aluno a ON v.Aluno = a.Id_Aluno
LEFT JOIN Pessoa p ON a.Pessoa = p.Id_Pessoa
ORDER BY v.Data_Hora_Validacao DESC
LIMIT 50
";

$result = $conn->query($sql);

$dados = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dados[] = [
            "Id_Validacao" => $row["Id_Validacao"],
            "Nome" => $row["Nome_Pessoa"] ?? "N/D",
            "Numero_Aluno" => $row["Numero_Aluno"] ?? "N/D",
            "Id_Senha" => $row["Senha"] ?? null,
            "Resultado" => $row["Resultado_Validacao"],
            "Data_Hora" => $row["Data_Hora_Validacao"]
        ];
    }
}

$conn->close();

echo json_encode($dados, JSON_UNESCAPED_UNICODE);
?>
