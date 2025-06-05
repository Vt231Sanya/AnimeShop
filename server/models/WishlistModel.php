<?php
class WishlistModel {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function exists($customerId, $productId) {
        $stmt = $this->pdo->prepare("SELECT * FROM wishlists WHERE customer_id = ? AND product_id = ?");
        $stmt->execute([$customerId, $productId]);
        return $stmt->fetch() !== false;
    }

    public function add($customerId, $productId) {
        $stmt = $this->pdo->prepare("INSERT INTO wishlists (customer_id, product_id) VALUES (?, ?)");
        return $stmt->execute([$customerId, $productId]);
    }

    public function remove($customerId, $productId) {
        $stmt = $this->pdo->prepare("DELETE FROM wishlists WHERE customer_id = ? AND product_id = ?");
        return $stmt->execute([$customerId, $productId]);
    }

    public function getProductIds($customerId) {
        $stmt = $this->pdo->prepare("SELECT product_id FROM wishlists WHERE customer_id = ?");
        $stmt->execute([$customerId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getProductDetails(array $productIds) {
        if (empty($productIds)) return [];

        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE product_id IN ($placeholders)");
        $stmt->execute($productIds);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
