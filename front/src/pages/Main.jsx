import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import axios from "axios";
import Footer from "../components/Footer";
import NextButton from "../components/NextButton";
import {useNavigate} from "react-router-dom";
import Card from "../components/Card/Card";

const Main = ({filters, setFilters}) => {
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
    }
    const [products, setProducts] = useState([]);
    const [disProducts, setDisProducts] = useState([]);
    const fetchProducts = async () => {
        const response = await axios.get('http://animeshop/server/product.php', {
            params: {action: 'list'}
        });
        setProducts(response.data.slice(0, 4));
        const dis = response.data.filter(d => d.discount > 0).slice(0, 4);
        console.log(dis);
        setDisProducts(dis);
    }

    useEffect(() => {
        fetchProducts();
        setFilters({});
    }, []);
    return (
        <div style={styles.main} >
            <Header filters={filters} setFilters={setFilters}/>
            <div style={styles.content}>
                <div style={styles.container}>
                    <h1>Нові товари!</h1>
                    <div className="product-grid">
                        {products.map((product) => (
                            <Card key={product.product_id} product={product} />
                        ))}
                    </div>
                    <NextButton url='/product?cat=0' >Хочу Ще!</NextButton>
                    
                </div>
                <div style={styles.container}>
                    <h1>Акційні товари!</h1>
                    <div className="product-grid">
                        {disProducts.map((product) => (
                            <Card key={product.product_id} product={product} />
                        ))}
                    </div>
                    <NextButton url='/discounts' >Хочу Ще!</NextButton>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Main;