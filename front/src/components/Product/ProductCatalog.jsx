    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import './ProductCatalog.css';
    import {useSearchParams} from "react-router-dom";
    import Card from "../Card/Card";
    import PriceFilter from "../PriceFilter";

    export default function ProductCatalog({ filters, setFilters}) {
        const [products, setProducts] = useState([]);
        const [cat, setCat] = useState({ category_name: ''});
        const [maxPrice, setMaxPrice] = useState({maxPrice: '10'});
        const [searchParams] = useSearchParams();
        const categoryId = searchParams.get('cat');

        useEffect(() => {
            fetchCategories();
            fetchProducts();
            fetchMaxPrice()
        }, [filters]);

        const fetchCategories = async () => {
            const response = await axios.get('http://animeshop/server/categories.php', {
                params: { action: 'list', cat: categoryId }
            });
            setCat(response.data);
        };
        const fetchProducts = async () => {
            const response = await axios.get('http://animeshop/server/product.php', {
                params: { action: 'list', ...filters }
            });
            setProducts(response.data);
        };
        const fetchMaxPrice = async () => {
            const response = await axios.get('http://animeshop/server/product.php', {
                params: { action: 'maxPrice'}
            });
            setMaxPrice(response.data);
            console.log(response.data);
        };
        const handlePriceChange = ([minPrice, maxPrice]) => {
            setFilters((prev) => ({ ...prev, ['minPrice']: minPrice,['maxPrice']: maxPrice }));
        };
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFilters((prev) => ({ ...prev, [name]: value }));
        };

        return (
            <div className={'product-catalog'}>
                <h1>{categoryId != 0 ? cat.category_name : "Всі категорії"}</h1>

                <PriceFilter min={0} max={maxPrice.maxPrice} onChange={handlePriceChange}/>
                <select name="sortOrder" className={"sortOrder"} value={filters.sortOrder} onChange={handleChange}>
                    <option value="">Без сортування</option>
                    <option value="price_asc">Ціна: Спочатку низька</option>
                    <option value="price_desc">Ціна: Спочатку висока</option>
                </select>
                <div className="product-grid">
                    {products.map((product) => (
                        <Card key={product.product_id} product={product} />
                    ))}
                </div>
            </div>
        );
    }
