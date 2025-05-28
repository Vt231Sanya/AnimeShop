<?php
require_once 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
global $pdo;
try {
    // Отримуємо JSON з тіла запиту
    $data = json_decode(file_get_contents('php://input'), true);

    // Перевірка обов’язкових полів
    if (
        !isset($data['product_id']) ||
        !isset($data['customer_id']) ||
        !isset($data['review_text']) ||
        !isset($data['rating'])
    ) {
        echo json_encode([
            "status" => "error",
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $product_id = (int)$data['product_id'];
    $customer_id = (int)$data['customer_id'];
    $review_text = trim($data['review_text']);
    $rating = (int)$data['rating'];

    if ($rating < 1 || $rating > 5) {
        echo json_encode([
            "status" => "error",
            "message" => "Rating must be between 1 and 5"
        ]);
        exit;
    }

    $sql = "INSERT INTO reviews (product_id, customer_id, review_text, rating, review_date) 
            VALUES (:product_id, :customer_id, :review_text, :rating, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':product_id' => $product_id,
        ':customer_id' => $customer_id,
        ':review_text' => $review_text,
        ':rating' => $rating
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Review added successfully"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

