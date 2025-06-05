<?php

class CartModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getCartItems($customer_id)
    {
        $stmt = $this->pdo->prepare("SELECT c.*, p.* FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.customer_id = ?");
        $stmt->execute([$customer_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addToCart($customer_id, $product_id)
    {
        $stmt = $this->pdo->prepare("INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, 1) 
            ON DUPLICATE KEY UPDATE quantity = quantity + 1");
        return $stmt->execute([$customer_id, $product_id]);
    }

    public function updateQuantity($cart_id, $quantity)
    {
        $stmt = $this->pdo->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
        return $stmt->execute([$quantity, $cart_id]);
    }

    public function deleteItem($cart_id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM cart WHERE cart_id = ?");
        return $stmt->execute([$cart_id]);
    }

    public function getRawCart($customer_id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM cart WHERE customer_id = ?");
        $stmt->execute([$customer_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function placeOrder($customer_id, $items)
    {
        $this->pdo->beginTransaction();
        $insert = $this->pdo->prepare("INSERT INTO orders (customer_id, product_id, quantity) VALUES (?, ?, ?)");
        $updateStock = $this->pdo->prepare("UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?");

        foreach ($items as $item) {
            $insert->execute([$item['customer_id'], $item['product_id'], $item['quantity']]);
            $updateStock->execute([$item['quantity'], $item['product_id'], $item['quantity']]);
            if ($updateStock->rowCount() === 0) {
                $this->pdo->rollBack();
                return ['success' => false, 'message' => "Недостатньо товару: {$item['product_id']}"];
            }
        }

        $clear = $this->pdo->prepare("DELETE FROM cart WHERE customer_id = ?");
        $clear->execute([$customer_id]);
        $this->pdo->commit();
        return ['success' => true];
    }
}
