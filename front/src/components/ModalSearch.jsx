import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const ModalSearch = ({products}) => {

    const navigate = useNavigate();
    const style = {
        position: "absolute",
        // top: "60px",
        // left: "20px",
        width: "30%",
        background: "#fff",
        borderRadius: "8px",
        color: "#1f2937",
        // backgroundColor: "azure",
        // boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 1000,
        padding: "10px",
        // height: "300px",
        // owerflow: "hidden",
    }
    return (
        <div style={style}>
            <strong>Результати:</strong>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "10px", maxHeight: "400px", overflow: "auto"}}>
                {products.map((item) => (
                    <li key={item.product_id} onClick={() => navigate(`/product/details?id=${item.product_id}`)} style={{ cursor: "pointer", padding: "5px 0", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between"}}>
                        <h2 style={{ maxWidth: '70%' }}>{item.name} </h2>
                        <img src={item.image} alt={item.name} style={{ maxWidth: '25%' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModalSearch;