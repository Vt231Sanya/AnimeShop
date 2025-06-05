<?php
class ReviewModel {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function addReview($productId, $customerId, $text, $rating) {
        if ($rating < 1 || $rating > 5) {
            throw new Exception("Rating must be between 1 and 5");
        }

        $sql = "INSERT INTO reviews (product_id, customer_id, review_text, rating, review_date)
                VALUES (:product_id, :customer_id, :review_text, :rating, NOW())";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':product_id' => $productId,
            ':customer_id' => $customerId,
            ':review_text' => trim($text),
            ':rating' => $rating
        ]);
    }
}
