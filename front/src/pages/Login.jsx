import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {useDispatch} from "react-redux";
import Cookies from 'js-cookie';

const Login = ({ filters, setFilters }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const basePath = 'http://localhost/AnimeShop/server/index.php?controller=';

    const styles = {
        page: {
            backgroundColor: "azure",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            borderRadius: "2em",
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
            backgroundColor: "#FF6CF9",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            marginBottom: "0.8rem",
        },
        registerButton: {
            width: "100%",
            padding: "0.8rem",
            backgroundColor: "#9370DB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
        },
        error: {
            color: "red",
            marginBottom: "1rem",
            fontSize: "0.9rem",
            textAlign: "center",
        },
        main: {
            backgroundColor: "#1f2937",
        },
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Заповніть всі поля");
            return;
        }
        try {
            const response = await fetch(basePath + 'auth&action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const result = await response.json();
            console.log(result);
            Cookies.set('isAuth', true, { expires: 1 });
            Cookies.set('userId', result.customer_id, { expires: 1 });
            Cookies.set('userName', result.first_name, { expires: 1 });
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
        }

    };

    const handleRegisterRedirect = () => {
        navigate("/register");
    };

    return (
        <div style={styles.main}>
            <Header filters={filters} setFilters={setFilters} />
            <div style={styles.page}>
                <form style={styles.form} onSubmit={handleSubmit}>
                    <h2 style={styles.header}>Вхід до акаунту</h2>

                    {error && <div style={styles.error}>{error}</div>}

                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button style={styles.button} type="submit">
                        Увійти
                    </button>

                    <button
                        type="button"
                        style={styles.registerButton}
                        onClick={handleRegisterRedirect}
                    >
                        Зареєструватися
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
