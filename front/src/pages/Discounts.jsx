import React, {useEffect, useState} from 'react';
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card/Card";

const Discounts = ({filters, setFilters}) => {
    const styles = {
        content: {
            textAlign: "center",
            backgroundColor: "azure",
            minHeight: "100vh",
            borderRadius: "2em",
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            gap: "2em",
        },
        main: {
            backgroundColor: "#1f2937",
        },
    }
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const response = await axios.get('http://animeshop/server/product.php', {
            params: { action: 'list' }
        });
        setProducts(response.data);
    }

    useEffect(() => {
        fetchProducts();
        setFilters({});
    }, []);
    return (
        <div style={styles.main} >
            <Header filters={filters} setFilters={setFilters}/>
            <div style={styles.content}>
                <h1>Акційні товари!</h1>
                <div className="product-grid">
                    {products.map((product) => (
                        product.discount > 0 && <Card key={product.product_id} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Discounts;