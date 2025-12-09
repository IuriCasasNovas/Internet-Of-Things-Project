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

    $stmt = $pdo->prepare("
        SELECT Id_Aluno, 
        (SELECT COUNT(*) 
         FROM Senha s 
         JOIN Compra c ON s.Compra = c.Id_Compra 
         WHERE c.Aluno = Aluno.Id_Aluno 
         AND s.Estado_Senha = (SELECT Id_Estado_Senha FROM Estado_Senha WHERE Estado='Disponivel')
        ) as Total
        FROM Aluno WHERE Pessoa = ?");
    $stmt->execute([$user['id']]);
    $aluno = $stmt->fetch();

    if (!$aluno) throw new Exception("Aluno não encontrado.");
    if (($aluno['Total'] + $qtd) > 30) throw new Exception("Limite de carteira excedido.");

    $valorTotal = $qtd * 2.90;

    $sql = "INSERT INTO Compra (Aluno, Valor_Total_Compra, Metodo_Pagamento_Compra, Data_Hora_Compra) VALUES (?, ?, ?, NOW())";
    $pdo->prepare($sql)->execute([$aluno['Id_Aluno'], $valorTotal, $metodosValidos[$metodo]]);
    $idCompra = $pdo->lastInsertId();

    $stmtEstado = $pdo->query("SELECT Id_Estado_Senha FROM Estado_Senha WHERE Estado = 'Disponivel'");
    $idEstadoSenha = $stmtEstado->fetchColumn() ?: 1;

    $stmtSenha = $pdo->prepare("INSERT INTO Senha (Compra, Estado_Senha, Preco_Senha, Data_Validade_Senha) VALUES (?, ?, 2.90, DATE_ADD(NOW(), INTERVAL 1 YEAR))");
    
    for ($i = 0; $i < $qtd; $i++) {
        $stmtSenha->execute([$idCompra, $idEstadoSenha]);
    }

    $pdo->commit();

    $res = ['success' => true, 'message' => 'Compra efetuada!', 'metodo' => $metodo];
    
    if ($metodo === 'multibanco') {
        $res += ['entidade' => 21223, 'referencia' => rand(100000000, 999999999), 'valor' => number_format($valorTotal, 2)];
    }

    enviarEmail($user['email'], $user['nome'], $idCompra, $qtd, $valorTotal, $res);

    echo json_encode($res);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    json_out(500, $e->getMessage());
}

function json_out($code, $msg) {
    http_response_code($code);
    echo json_encode(['message' => $msg]);
    exit;
}

function enviarEmail($email, $nome, $idCompra, $qtd, $total, $dados) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'inforsenhas.oficial@gmail.com';
        $mail->Password = 'waja zuwc vtht iafm';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom('inforsenhas.oficial@gmail.com', 'InforSenhas');
        $mail->addAddress($email, $nome);
        $mail->isHTML(true);
        $mail->Subject = "Recibo de Compra #$idCompra";

        $extra = ($dados['metodo'] === 'multibanco') ? 
            "<br><strong>Dados MB:</strong> Ent: {$dados['entidade']} | Ref: {$dados['referencia']}" : "";
        
        $mail->Body = "
            <div style='font-family:sans-serif; padding:20px; border:1px solid #ddd;'>
                <h2 style='color:#00b894'>Compra Confirmada</h2>
                <p>Olá <b>$nome</b>, obrigado pela tua compra.</p>
                <ul>
                    <li>Ref: #$idCompra</li>
                    <li>Qtd: $qtd Senhas</li>
                    <li>Total: " . number_format($total, 2) . "€</li>
                    <li>Método: {$dados['metodo']}</li>
                </ul>
                $extra
                <p style='font-size:12px; color:#777'>InforSenhas Automático</p>
            </div>";

        $mail->send();
    } catch (Exception $e) { error_log("Mail Error: {$mail->ErrorInfo}"); }
}
?>