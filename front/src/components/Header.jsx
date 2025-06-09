import React, {useEffect, useState} from "react";
import { FaThLarge, FaSearch, FaHeart, FaShoppingCart, FaUser, FaBars } from "react-icons/fa";
import  logo from"../img/logo.png"
import axios from "axios";
import ModalSearch from "./ModalSearch";
import {useNavigate} from "react-router-dom";
import Logout from "./Logout";
import Cookies from "js-cookie";
import styled from 'styled-components';


const Header = ({filters, setFilters}) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const basePath = 'http://localhost/AnimeShop/server/index.php?controller=';
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
        const selectedCategory = e.target.value;
        setFilters((prev) => ({ ...prev, categoryId: selectedCategory }));
        navigate("/product?cat=" + selectedCategory);
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
        const response = await axios.get(basePath + 'categories');
        setCategories(response.data);
    };
    const fetchProducts = async () => {
        const response = await axios.get(basePath + 'product', {
            params: { action: 'list', search: searchInput }
        });
        setProducts(response.data);
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [filters, searchInput]);

    const Icon = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: white;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.2);
    color: #9370DB;
  }
`;

    const Logo = styled.img`
  height: 50px;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

    const CategorySelect = styled.select`
  background-color: #9370DB;
  color: azure;
  border: none;
  border-radius: 30px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;

  //&:hover {
  //  transform: scale(1.05);
  //  background-color: #7a5fd1;
  //}
`;

    const SalesButton = styled.button`
  background-color: #9370DB;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
  }
`;

    const SearchIcon = styled.div`
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.2);
    color: #9370DB;
  }
`;

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
            gap: "2em",
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
                <div onClick={() => navigate("/")}>
                    <Logo src={logo} alt="Лого" />
                </div>

                <CategorySelect name="categoryId" value={filters.categoryId} onChange={categoryChange}>
                    <option value="0">Всі категорії</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.category_name}
                        </option>
                    ))}
                </CategorySelect>

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
                        <SearchIcon onClick={handleSearchSubmit}>
                            <FaSearch />
                        </SearchIcon>
                    </div>

                    {searchInput.length > 0 && products.length > 0 && modal && (
                        <ModalSearch
                            products={products}
                            onClick={() => setSearchInput("")}
                        />
                    )}
                </div>

                <SalesButton onClick={() => navigate('/discounts')}>Акції</SalesButton>

                <div style={styles.iconGroup}>
                    <Icon onClick={() => isAuthenticated ? navigate('/wishlist') : navigate('/login')}>
                        <FaHeart />
                    </Icon>
                    <Icon onClick={() => isAuthenticated ? navigate('/cart') : navigate('/login')}>
                        <FaShoppingCart />
                    </Icon>
                    <Icon onClick={() => isAuthenticated ? handleLogoutClick() : navigate('/login')}>
                        <FaUser />
                    </Icon>
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
