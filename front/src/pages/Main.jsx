import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import axios from "axios";
import Footer from "../components/Footer";
import NextButton from "../components/NextButton";
import Card from "../components/Card/Card";

const Main = ({ filters, setFilters }) => {
    const basePath = 'http://localhost/AnimeShop/server/';
    const [products, setProducts] = useState([]);
    const [disProducts, setDisProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const styles = {
        content: {
            backgroundColor: "azure",
            minHeight: "100vh",
            borderRadius: "2em",
            padding: "50px",
        },
        main: {
            backgroundColor: "#1f2937",
        },
        container: {
            textAlign: "center",
            padding: "1em",
            display: "flex",
            flexDirection: "column",
            gap: "2em",
        },
        header: {
            color: "#9370DB",
            fontSize: "2.8rem",
            fontWeight: "700",
            borderBottom: "4px solid #FF6CF9",
            paddingBottom: "0.5rem",
            maxWidth: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
        },
        loader: {
            textAlign: "center",
            fontSize: "1.2rem",
            padding: "2em",
            color: "#666",
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(basePath + 'product.php', {
                params: { action: 'list' }
            });
            setProducts(response.data.slice(0, 4));
            const dis = response.data.filter(d => d.discount > 0).slice(0, 4);
            setDisProducts(dis);
        } catch (e) {
            console.error("Loading products failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        setFilters({});
    }, []);

    return (
        <div style={styles.main}>
            <Header filters={filters} setFilters={setFilters} />
            <div style={styles.content}>
                {loading ? (
                    <div style={styles.loader}>Завантаження товарів...</div>
                ) : (
                    <>
                        <div style={styles.container}>
                            <h1 style={styles.header}>Нові товари!</h1>
                            <div className="product-grid">
                                {products.map((product) => (
                                    <Card key={product.product_id} product={product} />
                                ))}
                            </div>
                            <NextButton url='/product?cat=0'>Хочу Ще!</NextButton>
                        </div>
                        <div style={styles.container}>
                            <h1 style={styles.header}>Акційні товари!</h1>
                            <div className="product-grid">
                                {disProducts.map((product) => (
                                    <Card key={product.product_id} product={product} />
                                ))}
                            </div>
                            <NextButton url='/discounts'>Хочу Ще!</NextButton>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Main;
