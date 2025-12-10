<?php

date_default_timezone_set('Europe/Lisbon');


$host = '127.0.0.1'; 
$db   = 'InforSenhas';
$user = 'root';
$pass = 'root';     
$port = 8889;       
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    $offset = date('P');
    $pdo->exec("SET time_zone = '$offset';");

} catch (\PDOException $e) {
    die("Erro de Conexão com a Base de Dados: " . $e->getMessage() . 
        "<br>Verifica se o MAMP está ligado e se a porta ($port) está correta.");
}
?>