<?php
require_once __DIR__ . "/User.php";
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
class AuthController {
    private $userModel;
    public function __construct($pdo) {
        $this->userModel = new User($pdo);
    }

    public function login($email, $password) {
        $user = $this->userModel->findByEmail($email);
        if ($user && $password == $user['password']) {
            $_SESSION['user'] = $user;
            echo json_encode($user);
        } else {
            echo "Invalid email or password.";
        }
    }

    public function register($firstName, $lastName, $email, $password) {
        $existingUser = $this->userModel->findByEmail($email);
        if ($existingUser) {
            echo json_encode(['success' => false, 'message' => 'User already exists']);
            return;
        }

        if ($firstName != null && $lastName != null && $email != null && $password) {
            $success = $this->userModel->create($firstName, $lastName, $email, $password);
        }


        if ($success) {
            $user = $this->userModel->findByEmail($email);
            $_SESSION['user'] = $user;
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
    }



    public function logout() {
        session_destroy();
        header("Location: /views/login.php");
    }
}