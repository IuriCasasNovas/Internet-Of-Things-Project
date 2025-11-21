<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Não autorizado.']);
    exit;
}

if (!isset($_FILES['profilePic'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Nenhum ficheiro enviado.']);
    exit;
}

$file = $_FILES['profilePic'];
$userId = $_SESSION['user']['id'];

$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['message' => 'Apenas ficheiros de imagem são permitidos!']);
    exit;
}


$uploadDir = __DIR__ . '/../uploads/profiles/'; 
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = "user-{$userId}-" . time() . ".{$extension}";
$targetPath = $uploadDir . $filename;
$webPath = "/uploads/profiles/" . $filename;

try {
    $stmt = $pdo->prepare("SELECT Foto FROM Pessoa WHERE Id_Pessoa = ?");
    $stmt->execute([$userId]);
    $oldPhoto = $stmt->fetchColumn();

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        
        $update = $pdo->prepare("UPDATE Pessoa SET Foto = ? WHERE Id_Pessoa = ?");
        $update->execute([$webPath, $userId]);

        $_SESSION['user']['foto'] = $webPath;

        if ($oldPhoto) {

            $oldFilePath = __DIR__ . '/..' . $oldPhoto; 
            if (file_exists($oldFilePath) && is_file($oldFilePath)) {
                unlink($oldFilePath);
            }
        }

        echo json_encode([
            'message' => 'Foto de perfil atualizada!',
            'newPath' => $webPath
        ]);

    } else {
        throw new Exception("Falha ao mover o ficheiro enviado.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erro interno: ' . $e->getMessage()]);
}
?>