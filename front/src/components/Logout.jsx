import React from "react";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

const Logout = ({ isOpen, onClose, onConfirm }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        },
        modal: {
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            textAlign: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#1f2937",
        },
        buttons: {
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "space-around",
        },
        buttonConfirm: {
            backgroundColor: "#FF6CF9",
            border: "none",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1rem",
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
    const name = Cookies.get('userName');

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Привіт, {name}</h2>
                <div style={styles.buttons}>
                    <button
                        style={styles.buttonCancel}
                        onClick={() => {navigate('/orders')}}
                        type="button"
                    >
                        Мої Замовлення
                    </button>
                    <button
                        style={styles.buttonConfirm}
                        onClick={onConfirm}
                        type="button"
                    >
                        Вийти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Logout;
