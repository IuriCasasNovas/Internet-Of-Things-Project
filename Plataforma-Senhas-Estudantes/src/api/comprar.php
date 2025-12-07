<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require '../libs/PHPMailer/PHPMailer.php';
require '../libs/PHPMailer/SMTP.php';
require '../libs/PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;

$user = $_SESSION['user'] ?? null;
if (($user['role'] ?? '') !== 'aluno') json_out(403, 'Acesso negado.');

$d = json_decode(file_get_contents('php://input'), true);
$qtd = (int)($d['quantidade'] ?? 0);
$metodo = $d['metodo'] ?? '';
$tel = $d['telemovel'] ?? '';

$metodosValidos = ['mbway' => 'MB WAY', 'multibanco' => 'Multibanco'];

if ($qtd < 1 || $qtd > 10) json_out(400, 'Quantidade inválida (1-10).');
if (!isset($metodosValidos[$metodo])) json_out(400, 'Método inválido.');
if ($metodo === 'mbway' && !preg_match('/^9\d{8}$/', $tel)) json_out(400, 'Telemóvel inválido.');

try {
    $pdo->beginTransaction();

    // Obter aluno + total de senhas ativas
    $stmt = $pdo->prepare("
        SELECT Id_Aluno, 
        (SELECT COUNT(*) FROM Senha s 
         JOIN Compra c ON s.Compra = c.Id_Compra 
         WHERE c.Aluno = Aluno.Id_Aluno 
         AND s.Estado = (SELECT Id_Estado FROM Estado WHERE Estado='Ativo')
        ) as Total
        FROM Aluno 
        WHERE Pessoa = ?
    ");
    $stmt->execute([$user['id']]);
    $aluno = $stmt->fetch();

    if (!$aluno) throw new Exception("Aluno não encontrado.");
    if (($aluno['Total'] + $qtd) > 30) throw new Exception("Limite de carteira excedido.");

    // Buscar cartão do aluno
    $stmtCartao = $pdo->prepare("SELECT Id_Cartao FROM Cartao WHERE Aluno = ? AND Estado = 1 LIMIT 1");
    $stmtCartao->execute([$aluno['Id_Aluno']]);
    $idCartao = $stmtCartao->fetchColumn();

    if (!$idCartao) throw new Exception("Nenhum cartão ativo associado ao aluno.");

    // Criar compra
    $valorTotal = $qtd * 2.90;

    $sql = "INSERT INTO Compra (Aluno, Valor_Total_Compra, Metodo_Pagamento_Compra, Data_Hora_Compra)
            VALUES (?, ?, ?, NOW())";
    $pdo->prepare($sql)->execute([$aluno['Id_Aluno'], $valorTotal, $metodosValidos[$metodo]]);
    $idCompra = $pdo->lastInsertId();

    // Estado Ativo
    $idEstado = $pdo->query("SELECT Id_Estado FROM Estado WHERE Estado = 'Ativo'")->fetchColumn() ?: 1;

    // Criar senhas (agora com Cartao incluído)
    $stmtSenha = $pdo->prepare("
        INSERT INTO Senha (Compra, Cartao, Estado, Preco_Senha, Data_Validade_Senha)
        VALUES (?, ?, ?, 2.90, DATE_ADD(NOW(), INTERVAL 1 YEAR))
    ");

    for ($i = 0; $i < $qtd; $i++) {
        $stmtSenha->execute([$idCompra, $idCartao, $idEstado]);
    }

    // Commit
    $pdo->commit();

    // Resposta
    $res = [
        'success' => true,
        'message' => 'Compra efetuada!',
        'metodo'  => $metodo
    ];

    if ($metodo === 'multibanco') {
        $res += [
            'entidade'  => 21223,
            'referencia'=> rand(100000000, 999999999),
            'valor'     => number_format($valorTotal, 2)
        ];
    }

    enviarEmail($user['email'], $user['nome'], $idCompra, $qtd, $valorTotal, $res);

    echo json_encode($res);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    json_out(500, $e->getMessage());
}
?>