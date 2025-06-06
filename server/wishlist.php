<?php
require_once "connect.php";
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
global $pdo;
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $customer_id = $data['customer_id'] ?? null;
    $product_id = $data['product_id'] ?? null;

    if (!$customer_id || !$product_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing customer_id or product_id']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM wishlists WHERE customer_id = ? AND product_id = ?");
    $stmt->execute([$customer_id, $product_id]);
    if ($stmt->fetch()) {
        echo json_encode(['message' => 'Already in wishlist']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO wishlists (customer_id, product_id) VALUES (?, ?)");
    $stmt->execute([$customer_id, $product_id]);

    echo json_encode(['message' => 'Added to wishlist']);
    exit;
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $customer_id = $data['customer_id'] ?? null;
    $product_id = $data['product_id'] ?? null;

    if (!$customer_id || !$product_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing customer_id or product_id']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM wishlists WHERE customer_id = ? AND product_id = ?");
    $stmt->execute([$customer_id, $product_id]);

    echo json_encode(['message' => 'Removed from wishlist']);
    exit;
} elseif ($method === 'GET') {
    $customer_id = $_GET['customer_id'] ?? null;
    if (!$customer_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing customer_id']);
        exit;
    }

    $details = $_GET['details'] ?? '0';

    $stmt = $pdo->prepare("SELECT product_id FROM wishlists WHERE customer_id = ?");
    $stmt->execute([$customer_id]);
    $product_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($product_ids)) {
        echo json_encode(['wishlist' => []]);
        exit;
    }

    if ($details === '1') {
        // Возвращаем полный объект из таблицы product
        $placeholders = rtrim(str_repeat('?,', count($product_ids)), ',');
        $stmt = $pdo->prepare("SELECT * FROM products WHERE product_id IN ($placeholders)");
        $stmt->execute($product_ids);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['wishlist' => $products]);
    } else {
        echo json_encode(['wishlist' => $product_ids]);
    }
    exit;
}
else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
