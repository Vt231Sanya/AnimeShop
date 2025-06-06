import React, {use, useEffect, useState} from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import CartButton from "../components/CartButton";
import CheckBox from "../components/CheckBox";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import StarRating from "../components/StarRating";

const ProductDetails = ({ filters, setFilters }) => {
    const styles = {
        page: {
            backgroundColor: "azure",
            color: "#1f2937",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            minHeight: "100vh",
            padding: "3rem 5vw",
            lineHeight: 1.6,
            borderRadius: "2em",
        },
        header: {
            color: "#9370DB",
            fontSize: "2.8rem",
            marginBottom: "2rem",
            fontWeight: "700",
            borderBottom: "4px solid #FF6CF9",
            paddingBottom: "0.5rem",
            maxWidth: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
        },
        productWrapper: {
            display: "flex",
            gap: "3rem",
            maxWidth: "900px",
            margin: "0 auto 3rem auto",
            flexWrap: "wrap",
            alignItems: "flex-start",
        },
        image: {
            width: "100%",
            maxWidth: "400px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(147, 112, 219, 0.3)",
            flexShrink: 0,
        },
        info: {
            flex: "1",
            minWidth: "280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
        },
        description: {
            whiteSpace: "pre-wrap",
            fontSize: "1.15rem",
            marginBottom: "2rem",
        },
        priceStockWrapper: {
            display: "flex",
            gap: "3rem",
            fontSize: "1.3rem",
            fontWeight: "600",
            marginBottom: "1rem",
        },
        price: {
            color: "#FF6CF9",
        },
        stock: {
            color: "#9370DB",
        },
        reviewsSection: {
            maxWidth: "900px",
            margin: "0 auto",
        },
        reviewsHeader: {
            color: "#9370DB",
            fontSize: "2rem",
            marginBottom: "1rem",
        },
        reviewItem: {
            backgroundColor: "#9370DB",
            borderRadius: "10px",
            padding: "1.2rem 1.5rem",
            marginBottom: "1rem",
            color: "azure",
            boxShadow: "0 4px 8px rgba(255,108,249,0.3)",
        },
        reviewRating: {
            fontWeight: "700",
            marginBottom: "0.4rem",
        },
        reviewText: {
            fontStyle: "italic",
            marginBottom: "0.6rem",
        },
        reviewDate: {
            fontSize: "0.9rem",
            opacity: 0.7,
        },
        main: {
            backgroundColor: "#1f2937",
        },
        productActions: {
            display: "flex",
            gap: "2em",
            alignItems: "center",
            marginBottom: "1rem",
        },
        reviewForm: {
            marginTop: "2rem",
            backgroundColor: "azure",
            borderRadius: "1rem",
            padding: "1.5rem",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
        },
        reviewInput: {
            width: "100%",
            height: "80px",
            marginBottom: "1rem",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical",
        },
        reviewSelect: {
            marginBottom: "1rem",
            padding: "0.4rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
        },
        submitButton: {
            padding: "0.6rem 1.2rem",
            backgroundColor: "#9370DB",
            color: "azure",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
        },
        buttonCancel: {
            backgroundColor: "#9370DB",
            border: "none",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1rem",
        },
    };
    const isAuth = Cookies.get("isAuth") || false;
    const navigate = useNavigate();
    const userId = isAuth ? Cookies.get("userId") : 0;
    const [inWishlist, setInWishlist] = useState(false);
    const basePath = "http://localhost/AnimeShop/server/index.php?controller=";
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("id");
    const [product, setProduct] = useState({
        name: "",
        image: "",
        description: "",
        price: 0,
        stock: 0,
        Reviews: [],
    });
    const [inCart, setInCart] = useState(false);

    // Нові стани для відгуку
    const [newReviewText, setNewReviewText] = useState("");
    const [newReviewRating, setNewReviewRating] = useState(5);

    const checkCart = () => {
        fetch(basePath + `cart&customer_id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                let found = false;
                data.forEach((item) => {
                    if (item.product_id === product.product_id) {
                        found = true;
                    }
                });
                setInCart(found);
            });
    };

    const addToCart = async () => {
        await fetch(basePath + "cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_id: userId, product_id: product.product_id }),
        });
        checkCart();
    };

    useEffect(() => {
        fetch(basePath + `wishlist&customer_id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.wishlist && data.wishlist.includes(product.product_id)) {
                    setInWishlist(true);
                } else {
                    setInWishlist(false);
                }
            });
    }, [product.product_id, userId]);

    const toggleWishlist = () => {
        if (!inWishlist) {
            fetch(basePath + "wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customer_id: userId, product_id: product.product_id }),
            })
                .then((res) => res.json())
                .then(() => setInWishlist(true))
                .catch((error) => {
                    console.error("Помилка при запиті:", error);
                    alert("Не вдалося оновити вишліст.");
                });
        } else {
            fetch(basePath + "wishlist", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customer_id: userId, product_id: product.product_id }),
            })
                .then((res) => res.json())
                .then(() => setInWishlist(false))
                .catch((error) => {
                    console.error("Помилка при запиті:", error);
                    alert("Не вдалося оновити вишліст.");
                });
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get(basePath + "product", {
                params: { action: "details", id: productId },
            });
            setProduct(response.data);
            checkCart();
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!isAuth) {
            navigate("/login");
            return;
        }
        if (newReviewText.trim() === "") {
            alert("Будь ласка, введіть текст відгуку");
            return;
        }
        try {
            await fetch(basePath + "reviews&action=add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_id: userId,
                    product_id: product.product_id,
                    review_text: newReviewText,
                    rating: newReviewRating,
                }),
            });
            fetchProduct();
            setNewReviewText("");
            setNewReviewRating(0);
        } catch (error) {
            console.error("Помилка при відправці відгуку:", error);
            alert("Не вдалося надіслати відгук.");
        }
    };

    const delProduct = async () => {
        try {
            await axios.delete(basePath + `product&action=delete?id=${productId}`);
            alert(
                "Товар успішно видалений. Ви можете повернутися до списку товарів, щоб відновити відгуки."
            );


        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    }

    return (
        <div style={styles.main}>
            <Header filters={filters} setFilters={setFilters} />
            <main style={styles.page}>
                <h1 style={styles.header}>{product.name}</h1>

                <div style={styles.productWrapper}>
                    <img src={product.image} alt={product.name} style={styles.image} />
                    <div style={styles.info}>
                        <p style={styles.description}>{product.description}</p>

                        <div style={styles.priceStockWrapper}>
                            <div style={styles.price}>Ціна: {product.price} грн</div>
                            <div style={styles.stock}>У наявності: {product.stock} шт.</div>
                        </div>
                        <div style={styles.productActions}>
                            <CartButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isAuth
                                        ? inCart
                                            ? navigate("/cart")
                                            : addToCart()
                                        : navigate("/login");
                                }}
                            >
                                {inCart ? "У кошику" : "Придбати"}
                            </CartButton>
                            <StarRating reviews={product.Reviews} />
                            <CheckBox
                                checked={inWishlist}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isAuth ? toggleWishlist() : navigate("/login");
                                }}
                                title="Like"
                            />
                        </div>
                        {userId == 1 &&
                            <div style={styles.productActions}>
                                <button
                                    style={styles.buttonCancel}
                                    onClick={() => {navigate('/edit/' + productId)}}
                                    type="button"
                                >
                                    Редагувати товар
                                </button>
                                <button
                                    style={styles.buttonCancel}
                                    onClick={() => {
                                        delProduct();
                                        navigate("/product");
                                        alert("Товар видаленний")
                                    }}
                                    type="button"
                                >
                                    Видалити товар
                                </button>
                            </div>
                        }


                    </div>
                </div>

                <section style={styles.reviewsSection}>
                    <h2 style={styles.reviewsHeader}>Відгуки</h2>
                    {product.Reviews.length === 0 ? (
                        <p>Немає відгуків</p>
                    ) : (
                        product.Reviews.map((review) => (
                            <article key={review.review_id} style={styles.reviewItem}>
                                <p style={styles.reviewRating}>Оцінка: {review.rating}/5</p>
                                <p style={styles.reviewText}>"{review.review_text}"</p>
                                <p style={styles.reviewDate}>Дата: {review.review_date}</p>
                            </article>
                        ))
                    )}

                    {isAuth ?
                        <form style={styles.reviewForm} onSubmit={submitReview}>
                            <label>
                                Ваш відгук:
                                <textarea
                                    style={styles.reviewInput}
                                    value={newReviewText}
                                    onChange={(e) => setNewReviewText(e.target.value)}
                                    placeholder="Напишіть ваш відгук..."
                                    required
                                />
                            </label>
                            <label style={{ marginRight: "1rem" }}>
                                Оцінка: {" "}
                                <select
                                    style={styles.reviewSelect}
                                    value={newReviewRating}
                                    onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                                >
                                    {[5, 4, 3, 2, 1].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type="submit" style={styles.submitButton}>
                                Надіслати відгук
                            </button>
                        </form>
                        :
                        <button
                            style={styles.buttonCancel}
                            onClick={() => {navigate('/login')}}
                            type="button"
                        >
                            Увійдіть в аккаунт, щоб надати відгук.
                        </button>
                    }
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetails;
