import React from "react";

function StarRating({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return <div>Нема оцінок</div>;
    }

    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    const roundedRating = Math.round(averageRating * 2) / 2;

    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= roundedRating) {
            stars.push(<span key={i} style={{ color: "gold", fontSize: "30px" }}>★</span>);
        } else if (i - 0.5 === roundedRating) {
            stars.push(<span key={i} style={{ color: "gold", fontSize: "30px" }}>☆</span>);
        } else {
            stars.push(<span key={i} style={{ color: "lightgray", fontSize: "30px" }}>★</span>);
        }
    }

    return (
        <div style={{ display: "flex", alignItems: "center", marginTop: "-12px"}}>
            {stars} <span>({averageRating.toFixed(2)})</span>
        </div>
    );
}

export default StarRating;
