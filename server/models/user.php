<?php
require_once "connect.php";
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
class User
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function findByEmail($email)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM customers WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($firstName, $lastName, $email, $password)
    {
        $stmt = $this->pdo->prepare("INSERT INTO customers (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
        return $stmt->execute([$firstName, $lastName, $email, $password]);
    }
}
