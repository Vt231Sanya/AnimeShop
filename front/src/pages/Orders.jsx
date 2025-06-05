import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Orders = ({ filters, setFilters }) => {
    const [ordersByDate, setOrdersByDate] = useState({});
    const basePath = "http://localhost/AnimeShop/server/index.php?controller=";
    const userId = Cookies.get("userId");

    const styles = {
        page: {
            backgroundColor: "azure",
            minHeight: "100vh",
            padding: "3rem 5vw",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#1f2937",
            borderRadius: "2em",
        },
        orderBlock: {
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 8px 20px rgba(147, 112, 219, 0.15)",
        },
        orderDate: {
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#9370DB",
        },
        item: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
        },
        name: {
            flex: 2,
            fontWeight: "500",
        },
        quantity: {
            flex: 1,
            textAlign: "center",
        },
        price: {
            flex: 1,
            textAlign: "right",
            color: "#FF6CF9",
            fontWeight: "600",
        },
        total: {
            textAlign: "right",
            marginTop: "1rem",
            fontSize: "1.1rem",
            fontWeight: "700",
            color: "#9370DB",
        },
        main: {
            backgroundColor: "#1f2937",
        },
        empty: {
            fontSize: "1.4rem",
            textAlign: "center",
            marginTop: "5rem",
            opacity: 0.7,
        },
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(basePath + "orders", {
                    params: { customer_id: userId },
                });
                if (response.data.status === "success") {
                    const grouped = {};
                    response.data.data.forEach((item) => {
                        const date = item.order_date;
                        if (!grouped[date]) grouped[date] = [];
                        grouped[date].push(item);
                    });
                    setOrdersByDate(grouped);
                }
            } catch (err) {
                console.error("Помилка при завантаженні замовлень", err);
            }
        };

        fetchOrders();
    }, []);

    const getTotal = (items) =>
        items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div style={styles.main}>
            <Header filters={filters} setFilters={setFilters} />
            <main style={styles.page}>
                <h1 style={styles.orderDate}>Ваші замовлення</h1>
                {Object.keys(ordersByDate).length === 0 ? (
                    <p style={styles.empty}>Замовлень поки немає.</p>
                ) : (
                    Object.entries(ordersByDate).map(([date, items]) => (
                        <div key={date} style={styles.orderBlock}>
                            <div style={styles.orderDate}>
                                Дата замовлення: {new Date(date).toLocaleString()}
                            </div>
                            {items.map((item, index) => (
                                <div key={index} style={styles.item}>
                                    <div style={styles.name}>{item.name}</div>
                                    <div style={styles.quantity}>
                                        ×{item.quantity}
                                    </div>
                                    <div style={styles.price}>
                                        {item.price * item.quantity} грн
                                    </div>
                                </div>
                            ))}
                            <div style={styles.total}>
                                Загальна сума: {getTotal(items)} грн
                            </div>
                        </div>
                    ))
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Orders;
