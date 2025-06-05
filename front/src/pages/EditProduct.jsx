import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cookies from "js-cookie";

const EditProduct = ({ filters, setFilters }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category_id: "",
        discount: "0.00",
    });

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const isAuth = Cookies.get("isAuth") || false;
    const basePath = "http://localhost/AnimeShop/server/index.php?controller=";

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
            return;
        }

        const fetchCategories = async () => {
            const res = await axios.get(basePath + "categories");
            setCategories(res.data);
        };

        const fetchProduct = async () => {
            const res = await axios.get(basePath + `product?action=details&id=${id}`);
            setFormData(res.data);
        };

        fetchCategories();
        fetchProduct();
    }, [id, isAuth, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            !formData.price ||
            !formData.stock ||
            !formData.image.trim() ||
            !formData.category_id
        ) {
            alert("Будь ласка, заповніть всі обов’язкові поля.");
            return;
        }

        try {
            await axios.post(`${basePath}product?action=edit&id=${id}`, formData);
            alert("Продукт успішно оновлено!");
            navigate("/product");
        } catch (error) {
            console.error("Помилка при оновленні продукту", error);
            alert("Помилка при оновленні продукту.");
        }
    };

    return (
        <div style={{ backgroundColor: "#1f2937" }}>
            <Header filters={filters} setFilters={setFilters} />
            <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", borderRadius: "2em", backgroundColor: "azure" }}>
                <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                    Редагувати продукт
                </h1>

                <form onSubmit={handleSubmit}>
                    <label>
                        Назва*:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                        />
                    </label>

                    <label>
                        Опис*:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                        />
                    </label>

                    <label>
                        Ціна (грн)*:
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                        />
                    </label>

                    <label>
                        Наявність (шт)*:
                        <input
                            type="number"
                            min="0"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                        />
                    </label>

                    <label>
                        URL зображення*:
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/image.jpg"
                            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                        />
                    </label>

                    <label>
                        Категорія*:
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
                        >
                            <option value="0">Виберіть категорію</option>
                            {categories.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Знижка (%):
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            style={{ width: "100%", marginBottom: "1.5rem", padding: "0.5rem" }}
                        />
                    </label>

                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#6A5ACD",
                            color: "azure",
                            padding: "0.7rem 1.5rem",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        Зберегти зміни
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default EditProduct;
