<?php
require "connect.php";
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'list':
        listCategories();
        break;
    case '':
        listAllCategories();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
function listCategories() {
    global $pdo;
    $id = intval($_GET['cat'] ?? 0);

    $stmt = $pdo->prepare("SELECT * FROM categories WHERE category_id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($product);
}

function listAllCategories()
{
    global $pdo;
    $sql = 'SELECT * FROM categories';

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($categories);
}
