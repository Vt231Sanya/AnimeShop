import React, {useEffect, useState} from 'react';
import './Card.css';
import CheckBox from "../CheckBox";
import CartButton from "../CartButton";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const Card = ({product}) => {
    const navigate = useNavigate();
    const basePath = 'http://localhost/AnimeShop/server/index.php?controller=';

    const isAuth = Cookies.get('isAuth') || false;
    const userId = isAuth ? Cookies.get('userId') : 0;
    const [inWishlist, setInWishlist] = useState(false);
    const [inCart, setInCart] = useState(false);
    const checkCart = () => {
        fetch(basePath + `cart?customer_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                data.forEach(item => {
                    if (item.product_id === product.product_id) {
                        setInCart(true);
                    }
                })
            });
    }
    const addToCart = async() => {
        await fetch(basePath + 'cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id: userId, product_id: product.product_id }),
        });
        checkCart();
    }
    useEffect(() => {
        fetch(basePath + `wishlist?customer_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.wishlist && data.wishlist.includes(product.product_id)) {
                    setInWishlist(true);
                }
            });
        checkCart();
    }, [product.product_id, userId]);

    const toggleWishlist = () => {
        if (!inWishlist) {
            // добавить в вишлист
            fetch(basePath + 'wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_id: userId, product_id: product.product_id }),
            })
                .then(res => res.json())
                .then(() => setInWishlist(true))
                .catch(error => {
                    console.error("Помилка при запиті:", error);
                    alert("Не вдалося оновити вишліст.");
            });
        } else {
            // удалить из вишлиста
            fetch(basePath + 'wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_id: userId, product_id: product.product_id }),
            })
                .then(res => res.json())
                .then(() => setInWishlist(false))
                .catch(error => {
                    console.error("Помилка при запиті:", error);
                    alert("Не вдалося оновити вишліст.");
                });
        }
    };
    return (
            product.stock > 0 &&
                <div key={product.product_id} className="product-card" onClick={() => navigate(`/product/details?id=${product.product_id}`)} >

                    <img src={product.image} alt={product.name} className="product-image" />

                    <h3 className="product-name">{product.name}</h3>
                    {product.discount > 0 ?
                        <div className="product-price-container">
                            <p style={{color: "red"}} className="product-price">{ product.price} грн</p>
                            <del><small>{+product.price + (product.price * (product.discount / 100))} грн</small></del>
                        </div>
                        :
                        <p className="product-price">{product.price} грн</p>
                    }

                    <div className="product-actions">
                        <CartButton onClick={(e) => {e.stopPropagation(); isAuth ? inCart ? navigate('/cart') : addToCart() : navigate('/login')}}>
                            {inCart ? "У кошику" : "Придбати"}
                        </CartButton>


                        <CheckBox checked={inWishlist} onClick={(e) => { e.stopPropagation(); isAuth ? toggleWishlist() : navigate('/login')}} title="Like" />
                    </div>
                </div>

    );
};

export default Card;