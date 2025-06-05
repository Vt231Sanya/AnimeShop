<?php

require_once __DIR__ . '/../models/OrderModel.php';

class OrderController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new OrderModel($pdo);
    }

    public function handle($action, $params)
    {
        switch ($action) {
            case 'history':
                $this->getOrderHistory($params);
                break;
            default:
                echo json_encode(['status' => 'error', 'message' => 'Unknown order action']);
                break;
        }
    }

    private function getOrderHistory($params)
    {
        if (!isset($params['customer_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'customer_id is required']);
            return;
        }

        $orders = $this->model->getOrdersByCustomerId($params['customer_id']);

        echo json_encode([
            'status' => 'success',
            'data' => $orders
        ]);
    }
}
