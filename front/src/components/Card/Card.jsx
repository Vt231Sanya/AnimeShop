import React, {useEffect, useState} from 'react';
import './Card.css';
import CheckBox from "../CheckBox";
import CartButton from "../CartButton";
import axios from "axios";

const Card = ({product}) => {
    // const [discounts, setDiscounts] = useState([])
    // const fetchDiscounts = async () => {
    //     const response = await axios.get('http://animeshop/server/discounts.php', {
    //         params: { action: 'all' }
    //     });
    //     setDiscounts(response.data);
    // }
    // const discountProduct = discounts.find(d => d.product_id === product.product_id);
    // const finalProduct = discountProduct || product;
    //
    // useEffect(() => {
    //     fetchDiscounts();
    // })
    return (

            product.stock > 0 &&
                <div key={product.product_id} className="product-card">

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
                        <CartButton />
                        <CheckBox title="Like" />
                    </div>
                </div>

    );
};

export default Card;