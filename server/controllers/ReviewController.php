<?php
require_once __DIR__ . '/../models/ReviewModel.php';

class ReviewController {
    private $model;

    public function __construct($pdo) {
        $this->model = new ReviewModel($pdo);
    }

    public function handle($action, $input) {
        switch ($action) {
            case 'add':
                $this->addReview($input);
                break;
            default:
                echo json_encode(['status' => 'error', 'message' => 'Unknown review action']);
        }
    }

    private function addReview($input) {
        if (
            !isset($input['product_id']) ||
            !isset($input['customer_id']) ||
            !isset($input['review_text']) ||
            !isset($input['rating'])
        ) {
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
            return;
        }

        try {
            $this->model->addReview(
                (int)$input['product_id'],
                (int)$input['customer_id'],
                $input['review_text'],
                (int)$input['rating']
            );

            echo json_encode(['status' => 'success', 'message' => 'Review added successfully']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}

