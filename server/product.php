<?php
require_once 'connect.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'list':
        listProducts();
        break;
    case 'details':
        getProductDetails();
        break;
    case 'create':
        createProduct();
        break;
    case 'edit':
        editProduct();
        break;
    case 'delete':
        deleteProduct();
        break;
    case 'maxPrice':
        maxPrice();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function listProducts()
{
    global $pdo;

    $category_id = $_GET['categoryId'] ?? null;
    $search = $_GET['search'] ?? '';
    $sort = $_GET['sortOrder'] ?? '';
    $minPrice = $_GET['minPrice'] ?? null;
    $maxPrice = $_GET['maxPrice'] ?? null;
    $minDiscount = $_GET['minDiscount'] ?? null;

    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    $sql = "SELECT * FROM Products";
    $params = [];
    $where = [];

    if ($category_id) {
        $where[] = "category_id = :category_id";
        $params[':category_id'] = $category_id;
    }

    if ($search) {
        $where[] = "name LIKE :search";
        $params[':search'] = "%$search%";
    }

    if ($minPrice !== null) {
        $where[] = "price >= :minPrice";
        $params[':minPrice'] = $minPrice;
    }

    if ($maxPrice !== null) {
        $where[] = "price <= :maxPrice";
        $params[':maxPrice'] = $maxPrice;
    }

    if ($minDiscount !== null) {
        $where[] = "discount >= :minDiscount";
        $params[':minDiscount'] = $minDiscount;
    }

    if ($where) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }

    if ($sort === 'price_asc') {
        $sql .= " ORDER BY price ASC";
    } elseif ($sort === 'price_desc') {
        $sql .= " ORDER BY price DESC";
    }

    // Добавляем limit и offset
    $sql .= " LIMIT :limit OFFSET :offset";
    $params[':limit'] = $limit;
    $params[':offset'] = $offset;

    $stmt = $pdo->prepare($sql);

    // Привязываем limit и offset как int
    foreach ($params as $key => $value) {
        $paramType = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
        $stmt->bindValue($key, $value, $paramType);
    }

    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
}




function getProductDetails()
{
    global $pdo;
    $id = intval($_GET['id'] ?? 0);

    $stmt = $pdo->prepare("SELECT * FROM Products WHERE product_id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        return;
    }

    $stmt = $pdo->prepare("SELECT * FROM Reviews WHERE product_id = ?");
    $stmt->execute([$id]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $product['Reviews'] = $reviews;
    echo json_encode($product);
}

function createProduct()
{
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['name']) || trim($data['name']) === "") {
        return;
    }
    $stmt = $pdo->prepare("INSERT INTO Products (name, description, price, stock, image, category_id, discount) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['name'],
        $data['description'],
        $data['price'],
        $data['stock'],
        $data['image'],
        $data['category_id'],
        $data['discount'] ?? 0.00
    ]);

    echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
}

function editProduct()
{
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare("UPDATE Products SET name=?, description=?, price=?, stock=?, image=?, category_id=?, discount=? WHERE product_id =?");
    $stmt->execute([
        $data['name'],
        $data['description'],
        $data['price'],
        $data['stock'],
        $data['image'],
        $data['category_id'],
        $data['discount'] ?? 0.00,
        $_GET['id']
    ]);

    echo json_encode(['status' => 'updated']);
}

function deleteProduct()
{
    global $pdo;
    $id = intval($_POST['id'] ?? $_GET['id'] ?? 0);

    // Удалить связанные отзывы
    $stmtReviews = $pdo->prepare("DELETE FROM Reviews WHERE product_id = ?");
    $stmtReviews->execute([$id]);

    // Удалить сам продукт
    $stmtProduct = $pdo->prepare("DELETE FROM Products WHERE product_id = ?");
    $stmtProduct->execute([$id]);

    echo json_encode(['status' => 'deleted']);
}


function maxPrice()
{
    global $pdo;
    $sql = "SELECT MAX(price) AS maxPrice FROM products";
    $stmt = $pdo->prepare($sql);

    if ($stmt && $stmt->execute()) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $maxPrice = $row['maxPrice'] ?? 0;
    } else {
        $maxPrice = 0;
    }

    header('Content-Type: application/json');
    echo json_encode(['maxPrice' => $maxPrice]);
}

