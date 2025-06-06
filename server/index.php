<?php

session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");

require_once 'connect.php';

$uri = $_GET['controller'] ?? '';
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$params = array_merge($_GET, $_POST);
$input = json_decode(file_get_contents('php://input'), true) ?? [];
global $pdo;
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
switch ($uri) {
    case 'auth':
        require_once 'controllers/AuthController.php';
        $controller = new AuthController($pdo);

        if ($action === 'login') {
            $controller->login($input);
        } elseif ($action === 'register') {
            $controller->register($input);
        } elseif ($action === 'logout') {
            $controller->logout();
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Unknown auth action']);
        }
        break;
    case 'product':
        require_once 'controllers/ProductController.php';
        require_once 'models/ProductModel.php';
        $controller = new ProductController($pdo);

        switch ($action) {
            case 'list':
                $controller->listProducts($_GET);
                break;
            case 'details':
                $controller->getProductDetails($_GET);
                break;
            case 'create':
                $controller->createProduct($input);
                break;
            case 'edit':
                $controller->editProduct($_GET, $input);
                break;
            case 'delete':
                $controller->deleteProduct($_GET + $_POST);
                break;
            case 'maxPrice':
                $controller->getMaxPrice();
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Unknown product action']);
        }
        break;

    case 'cart':
        require_once 'controllers/CartController.php';
        $cart = new CartController($pdo);
        $cart->handleRequest($method, $input);
        break;

    case 'categories':
        require_once 'controllers/CategoryController.php';
        $category = new CategoryController($pdo);
        $category->handle($action, $params);
        break;

    case 'orders':
        require_once 'controllers/OrderController.php';
        $ctrl = new OrderController($pdo);
        $ctrl->handle($action, $params);
        break;

    case 'reviews':
        require_once 'controllers/ReviewController.php';
        $controller = new ReviewController($pdo);
        $controller->handle($action, $input);
        break;

    case 'wishlist':
        require_once 'controllers/WishlistController.php';
        $controller = new WishlistController($pdo);
        $controller->handle($_SERVER['REQUEST_METHOD'], $input, $_GET);
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Unknown controller']);
        break;
}
