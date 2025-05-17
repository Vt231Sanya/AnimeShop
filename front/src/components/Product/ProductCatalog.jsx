import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductCatalog.css';

export default function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({ categoryId: '', search: '', sortOrder: '' });

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [filters]);

    const fetchCategories = async () => {
        const response = await axios.get('http://animeshop/server/categories.php'); // або свій endpoint
        setCategories(response.data);
    };

    const fetchProducts = async () => {
        const response = await axios.get('http://animeshop/server/product.php', {
            params: { action: 'list', ...filters }
        });
        setProducts(response.data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className={'product-catalog'}>
            <h1>Каталог</h1>

            <form className="filter-form">
                <select name="categoryId" value={filters.categoryId} onChange={handleChange}>
                    <option value="">Всі категорії</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.category_name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="search"
                    placeholder="Пошук за назвою"
                    value={filters.search}
                    onChange={handleChange}
                />

                <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
                    <option value="">Без сортування</option>
                    <option value="price_asc">Ціна: Спочатку низька</option>
                    <option value="price_desc">Ціна: Спочатку висока</option>
                </select>
            </form>

            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.product_id} className="product-card">
                        <h2>{product.name}</h2>
                        <img src={product.image} alt={product.name} style={{ maxWidth: '100%' }} />
                        <p>{product.price} грн</p>
                        <button>Купити</button>
                        <button>❤</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
