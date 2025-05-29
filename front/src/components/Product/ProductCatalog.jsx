import React, {useEffect, useState, useCallback, useRef} from 'react';
import axios from 'axios';
import './ProductCatalog.css';
import { useNavigate, useSearchParams} from "react-router-dom";
import Card from "../Card/Card";
import PriceFilter from "../PriceFilter";
import Cookies from "js-cookie";

export default function ProductCatalog({ filters, setFilters }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cat, setCat] = useState({ category_name: '' });
    const [maxPrice, setMaxPrice] = useState({ maxPrice: '1' });
    const [searchParams] = useSearchParams();
    const [price, setPrice] = useState({ minPrice: 0, maxPrice: 10 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const userId = Cookies.get("userId");
    const categoryId = searchParams.get('cat');
    const basePath = 'http://localhost/AnimeShop/server/';
    const isFetchingRef = useRef(false);


    // Reset on filters change
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
    }, [filters]);

    useEffect(() => {
        fetchCategories();
        fetchMaxPrice();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page, filters]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
                !loading && hasMore
            ) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    const fetchCategories = async () => {
        const response = await axios.get(basePath + 'categories.php', {
            params: { action: 'list', cat: categoryId }
        });
        setCat(response.data);
    };

    const fetchProducts = async () => {
        if (isFetchingRef.current) return; // защита от повторов
        isFetchingRef.current = true;
        setLoading(true);
        try {
            const response = await axios.get(basePath + 'product.php', {
                params: {
                    action: 'list',
                    limit: 20,
                    offset: (page - 1) * 20,
                    ...filters
                }
            });

            const newProducts = response.data;

            setProducts(prev => {
                const existingIds = new Set(prev.map(p => p.product_id));
                const filtered = newProducts.filter(p => !existingIds.has(p.product_id));
                return [...prev, ...filtered];
            });

            if (newProducts.length < 20) {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Error loading products", e);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };


    const fetchMaxPrice = async () => {
        const response = await axios.get(basePath + 'product.php', {
            params: { action: 'maxPrice' }
        });
        setMaxPrice(response.data);
    };

    const handlePriceChange = ([minPrice, maxPrice]) => {
        setPrice({ minPrice, maxPrice });
        setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className={'product-catalog'}>
            <h1 className={'header'}>{categoryId != 0 ? cat.category_name : "Всі категорії"}</h1>

            {maxPrice.maxPrice != 1 &&
                <PriceFilter min={0} max={maxPrice.maxPrice} onChange={handlePriceChange} />
            }

            <select name="sortOrder" className={"sortOrder"} value={filters.sortOrder} onChange={handleChange}>
                <option value="">Без сортування</option>
                <option value="price_asc">Ціна: Спочатку низька</option>
                <option value="price_desc">Ціна: Спочатку висока</option>
            </select>

            {userId == 1 &&
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
            }

            <div className="product-grid">
                {products.map((product) => (
                    <Card key={product.product_id} product={product} />
                ))}
            </div>

            {loading && <div className="loader">Завантаження...</div>}
        </div>
    );
}
