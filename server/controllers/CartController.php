<?php

require_once __DIR__ . '/../models/CartModel.php';
require_once __DIR__ . '/../PHPMailer-6.10.0/src/Exception.php';
require_once __DIR__ . '/../PHPMailer-6.10.0/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer-6.10.0/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class CartController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new CartModel($pdo);
    }

    public function handleRequest($method, $input)
    {
        switch ($method) {
            case 'GET':
                $this->get();
                break;
            case 'POST':
                $this->addOrCheckout($input);
                break;
            case 'DELETE':
                $this->delete($input);
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
    }

    private function get()
    {
        $customer_id = $_GET['customer_id'];
        echo json_encode($this->model->getCartItems($customer_id));
    }

    private function addOrCheckout($input)
    {
        $action = $input['action'] ?? 'add';

        if ($action === 'update') {
            $result = $this->model->updateQuantity($input['cart_id'], $input['quantity']);
            echo json_encode(['status' => $result ? 'quantity updated' : 'update failed']);
        } elseif ($action === 'checkout') {
            $customer_id = $input['customer_id'];
            $phone = $input['phone'];
            $items = $this->model->getRawCart($customer_id);

            if (empty($items)) {
                echo json_encode(['success' => false, 'message' => 'Cart is empty']);
                return;
            }

            $this->sendEmail($customer_id, $phone, $items);
            $result = $this->model->placeOrder($customer_id, $items);
            echo json_encode($result);
        } else {
            $result = $this->model->addToCart($input['customer_id'], $input['product_id']);
            echo json_encode(['status' => $result ? 'added' : 'failed']);
        }
    }

    private function delete($input)
    {
        error_log('DELETE input: ' . print_r($input, true));
        if (empty($input['cart_id'])) {
            echo json_encode(['status' => 'failed', 'message' => 'cart_id required']);
            return;
        }
        $result = $this->model->deleteItem($input['cart_id']);
        echo json_encode(['status' => $result ? 'cleared' : 'failed']);
    }


    private function sendEmail($customer_id, $phone, $items)
    {
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
            $body = "Користувач ID {$customer_id}, телефон {$phone}, замовив:\n";
            foreach ($items as $item) {
                $body .= "- ID товару: {$item['product_id']}, Кількість: {$item['quantity']}\n";
            }
            $mail->Body = $body;
            $mail->send();
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => "Email error: {$mail->ErrorInfo}"]);
            exit;
        }
    }
}
