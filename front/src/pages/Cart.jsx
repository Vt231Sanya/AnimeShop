import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Cart = ({ filters, setFilters }) => {
    const styles = {
        page: {
            backgroundColor: "azure",
            minHeight: "100vh",
            padding: "3rem 5vw",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#1f2937",
            borderRadius: "2em",
        },
        header: {
            fontSize: "2.8rem",
            fontWeight: "700",
            color: "#9370DB",
            marginBottom: "2rem",
            borderBottom: "4px solid #FF6CF9",
            paddingBottom: "0.5rem",
            maxWidth: "fit-content",
        },
        item: {
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            marginBottom: "1.2rem",
            boxShadow: "0 8px 20px rgba(147, 112, 219, 0.15)",
            gap: "1rem",
        },
        name: {
            fontWeight: "600",
            fontSize: "1.1rem",
            flex: 3,
        },
        quantityInput: {
            width: "60px",
            padding: "0.4rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            textAlign: "center",
        },
        price: {
            color: "#FF6CF9",
            fontWeight: "700",
            fontSize: "1.2rem",
            flex: 1,
            textAlign: "right",
        },
        deleteBtn: {
            backgroundColor: "#FF6CF9",
            border: "none",
            color: "white",
            padding: "0.4rem 0.7rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
        },
        total: {
            fontSize: "1.6rem",
            fontWeight: "700",
            color: "#9370DB",
            textAlign: "right",
            marginTop: "2rem",
        },
        emptyText: {
            fontSize: "1.4rem",
            textAlign: "center",
            marginTop: "5rem",
            opacity: 0.7,
        },
        main: {
            backgroundColor: "#1f2937",
        },
        button: {
            padding: "0.8rem",
            backgroundColor: "#9370DB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            marginTop: "1rem",
        },
        buttonDiv: {
            display: "flex",
            justifyContent: "flex-end",

        },
    };

    const basePath = 'http://localhost/AnimeShop/server/';
    const userId = Cookies.get('userId');
    const [cartItems, setCartItems] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(basePath + 'cart.php', {
                params: { customer_id: userId }
            });
            setCartItems(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    const createOrder = async () => {
        try {
            const response = await axios.post(basePath + 'cart.php', {
                action: "checkout",
                customer_id: userId
            });
            console.log(response.data);
        } catch (err) {
            console.error("Error creating order:", err);
        }
        fetchProducts();
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleQuantityChange = async (cart_id, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await axios.post(basePath + 'cart.php', {
                action: "update",
                cart_id,
                quantity: newQuantity
            });
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.cart_id === cart_id ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            console.error("Failed to update quantity:", err);
        }
    };

    const handleDelete = async (cart_id) => {
        try {
            await axios.delete(basePath + 'cart.php', {
                data: { cart_id }
            });
            fetchProducts();
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div style={styles.main}>
            <Header filters={filters} setFilters={setFilters} />
            <main style={styles.page}>
                <h1 style={styles.header}>Ваш кошик</h1>

                {cartItems.length === 0 ? (
                    <p style={styles.emptyText}>Кошик порожній.</p>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <div key={item.cart_id} style={styles.item}>
                                <div style={styles.name}>{item.name}</div>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    style={styles.quantityInput}
                                    onChange={(e) =>
                                        handleQuantityChange(item.cart_id, parseInt(e.target.value))
                                    }
                                />
                                <div style={styles.price}>
                                    {item.price * item.quantity} грн
                                </div>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(item.cart_id)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <div style={styles.total}>Загалом: {totalPrice} грн</div>
                        <div style={styles.buttonDiv}>
                            <button style={styles.button} onClick={createOrder}>
                                Зробити замовлення
                            </button>
                        </div>

                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
