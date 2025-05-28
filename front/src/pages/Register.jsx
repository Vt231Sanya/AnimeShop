import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = ({ filters, setFilters }) => {
    const navigate = useNavigate();
    const basePath = 'http://localhost/AnimeShop/server/';
    const [formData, setFormData] = useState({});

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const styles = {
        page: {
            backgroundColor: "azure",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        form: {
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
        },
        header: {
            fontSize: "1.8rem",
            marginBottom: "1rem",
            color: "#9370DB",
            textAlign: "center",
        },
        input: {
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
        },
        button: {
            width: "100%",
            padding: "0.8rem",
            backgroundColor: "#9370DB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "0.5rem"
        },
        backButton: {
            backgroundColor: "#FF6CF9",
        },
        error: {
            color: "red",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            textAlign: "center",
        },
        success: {
            color: "green",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            textAlign: "center",
        },
        main: {
            backgroundColor: "#1f2937",
        },
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, email, password } = formData;

        if (!firstName || !lastName || !email || !password) {
            setError("Будь ласка, заповніть всі поля.");
            setSuccess("");
            return;
        }

        setError("");
        setSuccess("Успішна реєстрація!");
        try {
            const response = await fetch(basePath + 'auth?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log(result);
            // navigate('/login');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={styles.main}>
            <Header filters={filters} setFilters={setFilters} />
            <div style={styles.page}>
                <form style={styles.form} onSubmit={handleSubmit}>
                    <h2 style={styles.header}>Реєстрація</h2>

                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}

                    <input
                        style={styles.input}
                        type="text"
                        name="firstName"
                        placeholder="Ім'я"
                        value={formData.firstName}
                        onChange={handleChange}
                    />

                    <input
                        style={styles.input}
                        type="text"
                        name="lastName"
                        placeholder="Прізвище"
                        value={formData.lastName}
                        onChange={handleChange}
                    />

                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button style={styles.button} type="submit">
                        Зареєструватися
                    </button>

                    <button
                        type="button"
                        style={{ ...styles.button, ...styles.backButton }}
                        onClick={() => navigate("/login")}
                    >
                        Назад до входу
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
