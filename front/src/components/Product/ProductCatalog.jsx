    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import './ProductCatalog.css';
    import {useNavigate, useSearchParams} from "react-router-dom";
    import Card from "../Card/Card";
    import PriceFilter from "../PriceFilter";

    export default function ProductCatalog({ filters, setFilters}) {
        const navigate = useNavigate();
        const [products, setProducts] = useState([]);
        const [cat, setCat] = useState({ category_name: ''});
        const [maxPrice, setMaxPrice] = useState({maxPrice: '1'});
        const [searchParams] = useSearchParams();
        const [price, setPrice] = useState({minPrice: 0, maxPrice: 10});
        const categoryId = searchParams.get('cat');
        const basePath = 'http://localhost/AnimeShop/server/';
        useEffect(() => {
            fetchCategories();
            fetchProducts();
            fetchMaxPrice();
        }, [filters]);

        const fetchCategories = async () => {
            const response = await axios.get(basePath + 'categories.php', {
                params: { action: 'list', cat: categoryId }
            });
            setCat(response.data);
        };
        const fetchProducts = async () => {
            const response = await axios.get(basePath + 'product.php', {
                params: { action: 'list', ...filters }
            });
            setProducts(response.data);
        };
        const fetchMaxPrice = async () => {
            const response = await axios.get(basePath + 'product.php', {
                params: { action: 'maxPrice'}
            });
            setMaxPrice(response.data);
            console.log(response.data);
        };
        const handlePriceChange = ([minPrice, maxPrice]) => {
            setPrice({minPrice, maxPrice});
            setFilters((prev) => ({ ...prev, ['minPrice']: minPrice,['maxPrice']: maxPrice }));
        };
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFilters((prev) => ({ ...prev, [name]: value }));
        };

        return (
            <div className={'product-catalog'}>
                <h1 className={'header'}>{categoryId != 0 ? cat.category_name : "Всі категорії"}</h1>
                {maxPrice.maxPrice != 1 &&  <PriceFilter min={0} max={maxPrice.maxPrice} onChange={handlePriceChange}/>}


                <select name="sortOrder" className={"sortOrder"} value={filters.sortOrder} onChange={handleChange}>
                    <option value="">Без сортування</option>
                    <option value="price_asc">Ціна: Спочатку низька</option>
                    <option value="price_desc">Ціна: Спочатку висока</option>
                </select>

                <button
                    style={{
                        backgroundColor: "#9370DB",
                        border: "none",
                        color: "white",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "1rem",
                    }}
                    onClick={() => navigate('/create')}
                    type="button"
                >
                    Створити товар
                </button>

                <div className="product-grid">
                    {products.map((product) => (
                        <Card key={product.product_id} product={product} />
                    ))}
                </div>
            </div>
        );
    }
