import React, {useEffect, useState} from "react";
import { FaThLarge, FaSearch, FaHeart, FaShoppingCart, FaUser, FaBars } from "react-icons/fa";
import  logo from"../img/logo.png"
import axios from "axios";
import ModalSearch from "./ModalSearch";
import {useNavigate} from "react-router-dom";
import Logout from "./Logout";
import Cookies from "js-cookie";

const Header = ({filters, setFilters}) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const basePath = 'http://localhost/AnimeShop/server/';
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const isAuthenticated = Cookies.get('isAuth');
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

    const handleLogoutClick = () => {
        setIsLogoutOpen(true);
    };

    const handleClose = () => {
        setIsLogoutOpen(false);
    };

    const handleConfirmLogout = () => {
        setIsLogoutOpen(false);
        Cookies.remove('isAuth');
        Cookies.remove('userId');
        Cookies.remove('userName');
        navigate('/login');
    };

    const fetchCategories = async () => {
        const response = await axios.get(basePath + 'categories.php');
        setCategories(response.data);
    };
    const fetchProducts = async () => {
        const response = await axios.get(basePath + 'product.php', {
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
            backgroundColor: "#9370DB",
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
            backgroundColor: "#9370DB",
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
                    <FaHeart onClick={() => {isAuthenticated ? navigate('/wishlist') : navigate('/login')}} style={styles.icon} />
                    <FaShoppingCart onClick={() => {isAuthenticated ? navigate('/cart') : navigate('/login')}} style={styles.icon} />
                    <FaUser onClick={() => {isAuthenticated ? handleLogoutClick() : navigate('/login')}} style={styles.icon} />
                </div>
            </div>
            <Logout
                isOpen={isLogoutOpen}
                onClose={handleClose}
                onConfirm={handleConfirmLogout}
            />
        </header>
    );
};

export default Header;
