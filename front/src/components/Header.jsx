import React, {useEffect, useState} from "react";
import { FaThLarge, FaSearch, FaHeart, FaShoppingCart, FaUser, FaBars } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import  logo from"../img/logo.png"
import axios from "axios";
import ModalSearch from "./ModalSearch";
import {useNavigate} from "react-router-dom";

const Header = ({filters, setFilters}) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setModal(true);
    };

    const handleSearchSubmit = () => {
        setFilters((prev) => ({ ...prev, search: searchInput }));
        navigate("/product?cat=0");
        setModal(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };
    const categoryChange = (e) => {
        navigate("/product?cat=" + e.target.value);
    }

    const fetchCategories = async () => {
        const response = await axios.get('http://animeshop/server/categories.php');
        setCategories(response.data);
    };
    const fetchProducts = async () => {
        const response = await axios.get('http://animeshop/server/product.php', {
            params: { action: 'list', search: searchInput }
        });
        setProducts(response.data);
    };
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [filters, searchInput]);

    const styles = {
        header: {
            color: "white",
            fontFamily: "sans-serif",
            width: "100%",
        },
        container: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1em",
            padding: "30px 20px",
        },
        logo: {
            height: "50px",
        },
        catalogButton: {
            backgroundColor: "#38b2ac",
            color: "azure",
            border: "none",
            borderRadius: "30px",
            padding: "10px 15px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
        },
        search: {
            width: "30%",
        },
        searchBar: {
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(to right, #4b5563, #374151)",
            borderRadius: "30px",
            padding: "5px 10px",

        },
        searchInput: {
            border: "none",
            background: "transparent",
            color: "white",
            outline: "none",
            flex: 1,
        },
        salesButton: {
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "10px 20px",
            cursor: "pointer",
        },
        iconGroup: {
            display: "flex",
            alignItems: "center",
            gap: "15px",
        },
        icon: {
            fontSize: "20px",
            cursor: "pointer",
        },
        lang: {
            backgroundColor: "#4b5563",
            padding: "5px 10px",
            borderRadius: "20px",
            fontSize: "14px",
        },
    };

    return (
        <header style={styles.header}>
            <div style={styles.topLine} />
            <div style={styles.container}>
                <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <img src={logo} alt="Лого" style={styles.logo} />
                </div>

                <select name="categoryId" style={styles.catalogButton} value={filters.categoryId} onChange={categoryChange}>
                    <FaThLarge />
                    <option value="0">Всі категорії</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.category_name}
                        </option>
                    ))}
                </select>

                <div style={styles.search}>
                    <div style={styles.searchBar}>
                        <input
                            name="search"
                            type="text"
                            placeholder="Пошук..."
                            style={styles.searchInput}
                            value={searchInput}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        <FaSearch
                            style={{ color: "white", cursor: "pointer" }}
                            onClick={handleSearchSubmit}
                        />
                    </div>

                    {searchInput.length > 0 && products.length > 0 && modal && (
                        <ModalSearch
                            products={products}
                            onClick={() => setSearchInput("")}
                        />
                    )}
                </div>



                <button style={styles.salesButton} onClick={() => navigate('/discounts')}>Акції</button>

                <div style={styles.iconGroup}>
                    <FaHeart style={styles.icon} />
                    <FaShoppingCart style={styles.icon} />
                    <span style={styles.lang}>UA</span>
                    <FaUser style={styles.icon} />
                    <FaBars style={styles.icon} />
                </div>
            </div>
        </header>
    );
};

export default Header;
