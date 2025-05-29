<?php
require_once 'connect.php';
require 'PHPMailer-6.10.0/src/Exception.php';
require 'PHPMailer-6.10.0/src/PHPMailer.php';
require 'PHPMailer-6.10.0/src/SMTP.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);
global $pdo;
switch ($method) {
    case 'GET':
        $customer_id = $_GET['customer_id'] ?? 0;
        $stmt = $pdo->prepare("SELECT c.*, p.* FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.customer_id = ?");
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
            $phone = $data['phone'];
            $stmt = $pdo->prepare("SELECT * FROM cart WHERE customer_id = ?");
            $stmt->execute([$customer_id]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'snagy.sasha@gmail.com';
                $mail->Password = 'wowvszwcyodwpgro';
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;

                $mail->setFrom('snagy.sasha@gmail.com', 'OnigirI');
                $mail->addAddress('vt231_noo@student.ztu.edu.ua');

                $mail->isHTML(false);
                $mail->Subject = 'Нове замовлення';
                $body = "Користувач з ID {$customer_id} та номером {$phone} зробив замовлення:\n\n";
                foreach ($items as $item) {
                    $body .= "Товар ID: {$item['product_id']}, Кількість: {$item['quantity']}\n";
                }
                $mail->Body = $body;

                $mail->send();
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => "Письмо не отправлено. Ошибка: {$mail->ErrorInfo}"]);
                exit;
            }

            if (empty($items)) {
                echo json_encode(['success' => false, 'message' => 'Cart is empty']);
                exit;
            }

            $insertStmt = $pdo->prepare("INSERT INTO orders (customer_id, product_id, quantity) VALUES (?, ?, ?)");
            $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?");

            foreach ($items as $item) {
                $insertStmt->execute([$item['customer_id'], $item['product_id'], $item['quantity']]);

                // Зменшуємо залишок на складі
                $updateStockStmt->execute([$item['quantity'], $item['product_id'], $item['quantity']]);

                // Перевірка, чи вдалося оновити stock
                if ($updateStockStmt->rowCount() === 0) {
                    echo json_encode(['success' => false, 'message' => "Недостатньо товару (ID: {$item['product_id']}) на складі."]);
                    exit;
                }
            }

            $deleteStmt = $pdo->prepare("DELETE FROM cart WHERE customer_id = ?");
            $deleteStmt->execute([$customer_id]);

            echo json_encode(['success' => true, 'message' => 'Order placed']);
        }
        else {
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

