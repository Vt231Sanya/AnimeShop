<?php
require_once __DIR__ . "/../models/user.php";
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");

class AuthController {
    private $userModel;

    public function __construct($pdo) {
        $this->userModel = new User($pdo);
        if(session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function login($input) {
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        if (!$email || !$password) {
            echo json_encode(['success' => false, 'message' => 'Email and password are required']);
            return;
        }

        $user = $this->userModel->findByEmail($email);
        if ($user && $password === $user['password']) {
            $_SESSION['user'] = $user;
            echo json_encode($user);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        }
    }

    public function register($input) {
        $firstName = $input['firstName'] ?? null;
        $lastName = $input['lastName'] ?? null;
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        if (!$firstName || !$lastName || !$email || !$password) {
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            return;
        }

        $existingUser = $this->userModel->findByEmail($email);
        if ($existingUser) {
            echo json_encode(['success' => false, 'message' => 'User already exists']);
            return;
        }

        $success = $this->userModel->create($firstName, $lastName, $email, $password);

        if ($success) {
            $user = $this->userModel->findByEmail($email);
            $_SESSION['user'] = $user;
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
    }

    public function logout() {
        if(session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
        echo json_encode(['success' => true, 'message' => 'Logged out']);
    }
}
