<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email e password são obrigatórios.']);
    exit;
}

try {
    $sql = "SELECT P.Id_Pessoa, P.Nome, P.Email, P.Palavra_Passe, P.Foto, 
                   Adm.Id_Administrador, Aux.Id_Auxiliar, Al.Id_Aluno
            FROM Pessoa AS P
            LEFT JOIN Administrador AS Adm ON P.Id_Pessoa = Adm.Pessoa
            LEFT JOIN Auxiliar AS Aux ON P.Id_Pessoa = Aux.Pessoa
            LEFT JOIN Aluno AS Al ON P.Id_Pessoa = Al.Pessoa
            WHERE P.Email = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Email ou password incorretos.']);
        exit;
    }

    $passwordMatches = false;
    if (preg_match('/^\$2[ay]\$/', $user['Palavra_Passe'])) {
        $passwordMatches = password_verify($password, $user['Palavra_Passe']);
    } else {
        $passwordMatches = ($password === $user['Palavra_Passe']);
    }

    if (!$passwordMatches) {
        http_response_code(401);
        echo json_encode(['message' => 'Email ou password incorretos.']);
        exit;
    }

    $role = 'user';
    $redirectTo = '/index.html';

    if ($user['Id_Administrador']) { 
        $role = 'admin'; 
        $redirectTo = 'admin.html'; 
    } elseif ($user['Id_Auxiliar']) { 
        $role = 'auxiliar'; 
        $redirectTo = 'painelfunc.html'; 
    } elseif ($user['Id_Aluno']) { 
        $role = 'aluno'; 
        $redirectTo = 'dashboard.html'; 
    }

    $_SESSION['user'] = [
        'id' => $user['Id_Pessoa'],
        'nome' => $user['Nome'],
        'email' => $user['Email'],
        'foto' => $user['Foto'],
        'role' => $role
    ];

    echo json_encode([
        'message' => 'Login bem-sucedido!',
        'role' => $role,
        'redirectTo' => $redirectTo
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erro interno do servidor.']);
}
?>