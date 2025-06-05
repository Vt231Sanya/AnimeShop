<?php
require_once __DIR__ . '/../models/WishlistModel.php';

class WishlistController {
    private $model;

    public function __construct($pdo) {
        $this->model = new WishlistModel($pdo);
    }

    public function handle($method, $input, $query) {
        switch ($method) {
            case 'POST':
                $this->add($input);
                break;
            case 'DELETE':
                $this->remove($input);
                break;
            case 'GET':
                $this->get($query);
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
    }

    private function add($data) {
        $customerId = $data['customer_id'] ?? null;
        $productId = $data['product_id'] ?? null;

        if (!$customerId || !$productId) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing customer_id or product_id']);
            return;
        }

        if ($this->model->exists($customerId, $productId)) {
            echo json_encode(['message' => 'Already in wishlist']);
            return;
        }

        $this->model->add($customerId, $productId);
        echo json_encode(['message' => 'Added to wishlist']);
    }

    private function remove($data) {
        $customerId = $data['customer_id'] ?? null;
        $productId = $data['product_id'] ?? null;

        if (!$customerId || !$productId) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing customer_id or product_id']);
            return;
        }

        $this->model->remove($customerId, $productId);
        echo json_encode(['message' => 'Removed from wishlist']);
    }

    private function get($query) {
        $customerId = $query['customer_id'] ?? null;
        $details = $query['details'] ?? '0';

        if (!$customerId) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing customer_id']);
            return;
        }

        $productIds = $this->model->getProductIds($customerId);

        if (empty($productIds)) {
            echo json_encode(['wishlist' => []]);
            return;
        }

        if ($details === '1') {
            $products = $this->model->getProductDetails($productIds);
            echo json_encode(['wishlist' => $products]);
        } else {
            echo json_encode(['wishlist' => $productIds]);
        }
    }
}
