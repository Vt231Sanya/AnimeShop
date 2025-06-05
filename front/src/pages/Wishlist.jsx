import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "../components/Card/Card";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Wishlist = (filters, setFilters) => {
    const [wishList, setWishList] = useState([]);
    const basePath = 'http://localhost/AnimeShop/server/index.php?controller=';
    const userId = Cookies.get('userId');

    const fetchWishlist = async () => {
        const response = await axios.get(basePath + 'wishlist', {
            params: { customer_id: userId, details: '1' }
        });
        setWishList(response.data.wishlist);
        console.log(wishList.wishList);
    };

    useEffect(() => {
        fetchWishlist();
    }, [wishList])

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
        list: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
        },
        item: {
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(147, 112, 219, 0.15)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "transform 0.2s ease",
            cursor: "pointer",
        },
        itemHover: {
            transform: "scale(1.03)",
        },
        image: {
            width: "100%",
            maxWidth: "200px",
            borderRadius: "10px",
            marginBottom: "1rem",
        },
        name: {
            fontWeight: "600",
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
            textAlign: "center",
        },
        price: {
            color: "#FF6CF9",
            fontWeight: "700",
            fontSize: "1.2rem",
        },
        emptyText: {
            fontSize: "1.4rem",
            textAlign: "center",
            marginTop: "5rem",
            opacity: 0.7,
        },
        main: {
            backgroundColor: "#1f2937",
            textAlign: "center",
        },
    };

    return (
        <div style={styles.main}>
            <Header filters={filters} setFilters={setFilters}/>
            <main style={styles.page}>
                <h1 style={styles.header}>Ваш вішліст</h1>

                {wishList.length === 0 ? (
                    <p style={styles.emptyText}>Ваш вішліст поки що порожній.</p>
                ) : (
                    <div style={styles.list}>
                        {wishList.map((product) => (
                            <Card product={product} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>

    );
};

export default Wishlist;
