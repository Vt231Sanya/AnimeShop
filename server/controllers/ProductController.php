<?php

class ProductController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new ProductModel($pdo);
    }

    public function listProducts($params)
    {
        echo json_encode($this->model->getAll($params));
    }

    public function listProductsDis($params)
    {
        echo json_encode($this->model->getAllForDis($params));
    }


    public function getProductDetails($params)
    {
        $id = intval($params['id'] ?? 0);
        $product = $this->model->getById($id);
        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }
        echo json_encode($product);
    }

    public function createProduct($data)
    {
        $result = $this->model->create($data);
        echo json_encode(['status' => 'success', 'id' => $result]);
    }

    public function editProduct($params, $data)
    {
        $id = intval($params['id'] ?? 0);
        $this->model->update($id, $data);
        echo json_encode(['status' => 'updated']);
    }

    public function deleteProduct($params)
    {
        $id = intval($params['id'] ?? 0);
        $this->model->delete($id);
        echo json_encode(['status' => 'deleted']);
    }

    public function getMaxPrice()
    {
        $max = $this->model->getMaxPrice();
        echo json_encode(['maxPrice' => $max]);
    }
}
