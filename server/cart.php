<?php
require_once 'connect.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);
global $pdo;
switch ($method) {
    case 'GET':
        $customer_id = $_GET['customer_id'] ?? 0;
        $stmt = $pdo->prepare("SELECT c.*, p.name, p.price FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.customer_id = ?");
        $stmt->execute([$customer_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $action = $data['action'] ?? 'add';

        if ($action === 'update' && isset($data['cart_id'], $data['quantity'])) {
            // Оновлення кількості
            $cart_id = $data['cart_id'];
            $quantity = $data['quantity'];

            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
            $stmt->execute([$quantity, $cart_id]);
            echo json_encode(['status' => 'quantity updated']);
        } elseif ($action === 'checkout') {
            $customer_id = $data['customer_id'];

            // Отримати товари з корзини для цього користувача
            $stmt = $pdo->prepare("SELECT * FROM cart WHERE customer_id = ?");
            $stmt->execute([$customer_id]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($items)) {
                echo json_encode(['success' => false, 'message' => 'Cart is empty']);
                exit;
            }

            $insertStmt = $pdo->prepare("INSERT INTO orders (customer_id, product_id, quantity) VALUES (?, ?, ?)");

            foreach ($items as $item) {
                $insertStmt->execute([$item['customer_id'], $item['product_id'], $item['quantity']]);
            }

            $deleteStmt = $pdo->prepare("DELETE FROM cart WHERE customer_id = ?");
            $deleteStmt->execute([$customer_id]);

            echo json_encode(['success' => true, 'message' => 'Order placed']);
        } else {
            $customer_id = $data['customer_id'];
            $product_id = $data['product_id'];

            $stmt = $pdo->prepare("INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)");
            $stmt->execute([$customer_id, $product_id]);
            echo json_encode(['status' => 'added']);
        }
        break;


    case 'DELETE':
        $cart_id = $data['cart_id'];
        $stmt = $pdo->prepare("DELETE FROM cart WHERE cart_id = ?");
        $stmt->execute([$cart_id]);
        echo json_encode(['status' => 'cleared']);
        break;
}

