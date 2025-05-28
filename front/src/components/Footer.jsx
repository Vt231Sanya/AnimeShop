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
                    <strong>Контакти</strong>
                    <span>Адреса: м.Житомир, пров. Шкільний 13</span>
                    <span>Телефон: +380 (68) 069-52-38</span>
                </div>

                <div style={style.section}>
                    <strong>Соціальні мережі</strong>
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
                    <span style={style.copyright}>&copy; 2025 Всі права захищенні.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;