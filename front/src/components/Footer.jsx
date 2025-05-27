import React from "react";
import { FaInstagram, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import {hover} from "@testing-library/user-event/dist/hover";

const style = {
    footer: {
        color: "azure",
        padding: "1em",
        fontSize: "24px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        maxWidth: "80%",
        margin: "0 auto",
        alignItems: "center",
    },
    section: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    iconContainer: {
        display: "flex",
        gap: "1em",
    },
    icon: {
        fontSize: "24px",
        color: "azure",
        transition: "color 0.3s"
    },
    copyright: {
        fontSize: "18px",
        color: "#777",
    }
};

const Footer = () => {
    return (
        <footer style={style.footer}>
            <div style={style.grid}>
                <div style={style.section}>
                    <strong>Контакты</strong>
                    <span>Адрес: г. Киев, ул. Примерная, 12</span>
                    <span>Телефон: +380 (67) 123-45-67</span>
                </div>

                <div style={style.section}>
                    <strong>Социальные сети</strong>
                    <div style={style.iconContainer}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram style={style.icon} />
                        </a>
                        <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                            <FaTelegramPlane style={style.icon} />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <FaTiktok style={style.icon} />
                        </a>
                    </div>
                </div>

                <div style={style.section}>
                    <span style={style.copyright}>&copy; 2025 Все права защищены.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;