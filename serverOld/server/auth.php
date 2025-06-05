<?php
require_once './connect.php';
require_once 'authController.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
global $pdo;
$controller = new AuthController($pdo);

$path = $_GET['action'] ?? $_POST['action'] ?? '';

$input = json_decode(file_get_contents('php://input'), true);

$email = $input['email'] ?? null;
$password = $input['password'] ?? null;
$firstName = $input['firstName'] ?? null;
$lastName = $input['lastName'] ?? null;

if ($path === 'login') {
    $controller->login($email, $password);
} elseif ($path === 'register') {
    $controller->register($firstName, $lastName, $email, $password);
} elseif ($path === 'logout') {
    $controller->logout();
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
}
