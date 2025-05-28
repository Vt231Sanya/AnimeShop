<?php
require_once 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
global $pdo;
try {
    if (!isset($_GET['customer_id'])) {
        echo json_encode(["status" => "error", "message" => "customer_id is required"]);
        exit;
    }

    $customer_id = $_GET['customer_id'];

    $sql = "
        SELECT 
            p.name,
            o.quantity,
            p.price,
            o.order_date
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        WHERE o.customer_id = :customer_id
        ORDER BY o.order_date DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['customer_id' => $customer_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $orders
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
