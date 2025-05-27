<?php

require_once  "connect.php";
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case '':
        listDiscount();
        break;
    case 'all':
        listAllDiscount();
        break;
    case 'create':
        createDiscount();
        break;
    case 'edit':
        editDiscount();
        break;
    case 'delete':
        deleteDiscount();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function listDiscount()
{
    global $pdo;
    $sql = 'SELECT * FROM products JOIN discounts ON products.product_id = discounts.product_id LIMIT 4';

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories);
}

function listAllDiscount()
{
    global $pdo;
    $sql = 'SELECT * FROM products JOIN discounts ON products.product_id = discounts.product_id';

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories);
}

function createDiscount()
{
    global $pdo;
    $data = json_decode(file_get_contents("php://input"), true);

// Извлечение значений
    $discount_percentage = $data['discount_percentage'];
    $start_date = $data['start_date'];
    $end_date = $data['end_date'];
    $product_id = $data['product_id'];

// Подготовка SQL-запроса
    $sql = 'INSERT INTO discounts (discount_percentage, start_date, end_date, product_id) VALUES (?, ? ,?, ?)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['discount_percentage'],
        $data['start_date'],
        $data['end_date'],
        $data['product_id'],
    ]);
    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
}



