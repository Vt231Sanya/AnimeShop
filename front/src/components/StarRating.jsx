import React from "react";

function StarRating({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return <div>Нема оцінок</div>;
    }

    // Вычисляем средний рейтинг
    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    // Округляем до половины звезды (например, 4.3 -> 4.5)
    const roundedRating = Math.round(averageRating * 2) / 2;

    // Создаем массив из 5 элементов для отображения звезд
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= roundedRating) {
            // Полная звезда
            stars.push(<span key={i} style={{ color: "gold", fontSize: "30px" }}>★</span>);
        } else if (i - 0.5 === roundedRating) {
            // Полузвезда (можно заменить на иконку, здесь для простоты символ)
            stars.push(<span key={i} style={{ color: "gold", fontSize: "30px" }}>☆</span>);
        } else {
            // Пустая звезда
            stars.push(<span key={i} style={{ color: "lightgray", fontSize: "30px" }}>★</span>);
        }
    }

    return (
        <div style={{ display: "flex", alignItems: "center", marginTop: "-12px"}}>
            {stars} <span>({averageRating.toFixed(2)})</span>
        </div>
    );
}

// Пример использования:
// <StarRating reviews={product.Reviews} />

export default StarRating;
