<?php

class ProductModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAllForDis($params)
    {
        $sql = "SELECT * FROM Products";
        $stmt = $this->pdo->prepare($sql);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAll($params)
    {
        $sql = "SELECT * FROM Products";
        $queryParams = [];
        $where = [];

        if (!empty($params['categoryId'])) {
            $where[] = "category_id = :category_id";
            $queryParams[':category_id'] = $params['categoryId'];
        }

        if (!empty($params['search'])) {
            $where[] = "name LIKE :search";
            $queryParams[':search'] = "%" . $params['search'] . "%";
        }

        if (isset($params['minPrice'])) {
            $where[] = "price >= :minPrice";
            $queryParams[':minPrice'] = $params['minPrice'];
        }

        if (isset($params['maxPrice'])) {
            $where[] = "price <= :maxPrice";
            $queryParams[':maxPrice'] = $params['maxPrice'];
        }

        if (isset($params['minDiscount'])) {
            $where[] = "discount >= :minDiscount";
            $queryParams[':minDiscount'] = $params['minDiscount'];
        }

        if ($where) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }

        if (!empty($params['sortOrder'])) {
            if ($params['sortOrder'] === 'price_asc') {
                $sql .= " ORDER BY price ASC";
            } elseif ($params['sortOrder'] === 'price_desc') {
                $sql .= " ORDER BY price DESC";
            }
        }

        $sql .= " LIMIT :limit OFFSET :offset";
        $queryParams[':limit'] = isset($params['limit']) ? (int)$params['limit'] : 20;
        $queryParams[':offset'] = isset($params['offset']) ? (int)$params['offset'] : 0;

        $stmt = $this->pdo->prepare($sql);

        foreach ($queryParams as $key => $value) {
            $type = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
            $stmt->bindValue($key, $value, $type);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM Products WHERE product_id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            return null;
        }

        $stmt = $this->pdo->prepare("SELECT * FROM Reviews WHERE product_id = ?");
        $stmt->execute([$id]);
        $product['Reviews'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $product;
    }

    public function create($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO Products (name, description, price, stock, image, category_id, discount)
            VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['description'],
            $data['price'],
            $data['stock'],
            $data['image'],
            $data['category_id'],
            $data['discount'] ?? 0.00
        ]);
        return $this->pdo->lastInsertId();
    }

    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE Products SET name=?, description=?, price=?, stock=?, image=?, category_id=?, discount=? WHERE product_id =?");
        $stmt->execute([
            $data['name'],
            $data['description'],
            $data['price'],
            $data['stock'],
            $data['image'],
            $data['category_id'],
            $data['discount'] ?? 0.00,
            $id
        ]);
    }

    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM Reviews WHERE product_id = ?");
        $stmt->execute([$id]);

        $stmt = $this->pdo->prepare("DELETE FROM Wishlists WHERE product_id = ?");
        $stmt->execute([$id]);

        $stmt = $this->pdo->prepare("DELETE FROM Cart WHERE product_id = ?");
        $stmt->execute([$id]);

        $stmt = $this->pdo->prepare("DELETE FROM Orders WHERE product_id = ?");
        $stmt->execute([$id]);

        $stmt = $this->pdo->prepare("DELETE FROM Products WHERE product_id = ?");
        $stmt->execute([$id]);
    }


    public function getMaxPrice()
    {
        $stmt = $this->pdo->prepare("SELECT MAX(price) AS maxPrice FROM Products");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['maxPrice'] ?? 0;
    }
}
