<?php

class OrderModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getOrdersByCustomerId($customerId)
    {
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

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['customer_id' => $customerId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
