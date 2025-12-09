<?php
header('Content-Type: application/json; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "InforSenhas";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["error" => "Erro ao conectar: " . $conn->connect_error], JSON_UNESCAPED_UNICODE);
    exit();
}

$sql = "
SELECT 
    v.Id_Validacao,
    v.Cartao,
    c.Id_Cartao,
    a.Id_Aluno,
    a.Numero_Aluno,
    p_aluno.Nome_Pessoa AS Nome_Aluno,
    v.Senha AS Id_Senha,
    s.Preco_Senha,
    s.Data_Validade_Senha,
    v.Resultado_Validacao,
    v.Data_Hora_Validacao,
    v.Auxiliar AS Id_Auxiliar,
    p_aux.Nome_Pessoa AS Nome_Auxiliar
FROM Validacao v
LEFT JOIN Cartao c     ON v.Cartao = c.Id_Cartao
LEFT JOIN Aluno a      ON c.Aluno = a.Id_Aluno
LEFT JOIN Pessoa p_aluno ON a.Pessoa = p_aluno.Id_Pessoa
LEFT JOIN Senha s      ON v.Senha = s.Id_Senha
LEFT JOIN Auxiliar aux ON v.Auxiliar = aux.Id_Auxiliar
LEFT JOIN Pessoa p_aux ON aux.Pessoa = p_aux.Id_Pessoa
ORDER BY v.Data_Hora_Validacao DESC
LIMIT 50;
";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["error" => $conn->error], JSON_UNESCAPED_UNICODE);
    $conn->close();
    exit();
}

$dados = [];

while ($row = $result->fetch_assoc()) {
    $dados[] = [
        "Id_Validacao" => (int)$row["Id_Validacao"],
        "Cartao_Id" => isset($row["Cartao"]) ? (int)$row["Cartao"] : null,
        "Cartao_PK" => isset($row["Id_Cartao"]) ? (int)$row["Id_Cartao"] : null,
        // Aluno
        "Id_Aluno" => isset($row["Id_Aluno"]) ? (int)$row["Id_Aluno"] : null,
        "Numero_Aluno" => $row["Numero_Aluno"] ?? "N/D",
        "Nome_Aluno" => $row["Nome_Aluno"] ?? "N/D",
        "Id_Senha" => isset($row["Id_Senha"]) ? (int)$row["Id_Senha"] : null,
        "Preco_Senha" => isset($row["Preco_Senha"]) ? (float)$row["Preco_Senha"] : null,
        "Data_Validade_Senha" => $row["Data_Validade_Senha"] ?? null,
        // Resultado e data
        "Resultado" => $row["Resultado_Validacao"] ?? null,
        "Data_Hora" => $row["Data_Hora_Validacao"] ?? null,
        // Auxiliar
        "Id_Auxiliar" => isset($row["Id_Auxiliar"]) ? (int)$row["Id_Auxiliar"] : null,
        "Nome_Auxiliar" => $row["Nome_Auxiliar"] ?? "N/D",
    ];
}

$conn->close();

echo json_encode($dados, JSON_UNESCAPED_UNICODE);
?>
