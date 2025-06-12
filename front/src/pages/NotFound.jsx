import React from "react";
import { motion } from "framer-motion";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1f2937",
        color: "azure",
        padding: "1rem",
        textAlign: "center",
    },
    code: {
        position: "relative",
        fontSize: "10rem",
        fontWeight: 800,
        color: "#9370DB",

    },
    codeSpan: {
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
    },
    image: {
        position: "absolute",
        top: "-3rem",
        left: "100%",
        transform: "translateX(-50%)",
        width: "10rem",
        height: "auto",
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
    },
    message: {
        marginTop: "1.5rem",
        fontSize: "1.25rem",
        color: "#FF6CF9",
    },
    button: {
        marginTop: "1rem",
        padding: "0.5rem 1.5rem",
        backgroundColor: "#9370DB",
        color: "white",
        borderRadius: "1rem",
        textDecoration: "none",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        display: "inline-block",
        transition: "background-color 0.3s ease",
        cursor: "pointer",
    },
    buttonHover: {
        backgroundColor: "#7a5bc2",
    },
};

export default function NotFound() {
    const [hover, setHover] = React.useState(false);

    return (
        <div style={styles.container}>
            <div style={styles.code}>
                <span style={styles.codeSpan}>404</span>
                <motion.img
                    src="https://pngimg.com/uploads/anime_girl/anime_girl_PNG27.png"
                    alt="Anime Girl Peeking"
                    style={styles.image}
                    initial={{ y: -100, opacity: 1 }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                        duration: 4,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                />

            </div>
            <p style={styles.message}>
                Йой! Ти шо тут робиш, куди ти жмакунв
            </p>
            <a
                href="/"
                style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                Повернутися на головну
            </a>
        </div>
    );
}
