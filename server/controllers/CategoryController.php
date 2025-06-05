<?php

require_once __DIR__ . '/../models/CategoryModel.php';

class CategoryController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new CategoryModel($pdo);
    }

    public function handle($action, $params)
    {
        switch ($action) {
            case 'list':
                $this->getCategory($params);
                break;
            case '':
            case 'all':
                $this->getAll();
                break;
            default:
                echo json_encode(['error' => 'Invalid action']);
        }
    }

    private function getAll()
    {
        $categories = $this->model->getAllCategories();
        echo json_encode($categories);
    }

    private function getCategory($params)
    {
        $id = intval($params['cat'] ?? 0);
        $category = $this->model->getCategoryById($id);
        echo json_encode($category);
    }
}
