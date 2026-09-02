import { useState } from "react";
import PropTypes from "prop-types";
import "./Dish.css";

function Dish({ name, price, currency, spicy, image, onAdd, onRemove }) {
const [count, setCount] = useState(0);

function handleAdd() {
    setCount((prev) => prev + 1);
    if (onAdd) {
    onAdd(price);
    }
}

function handleRemove() {
    setCount((prev) => {
        if (prev === 0) return 0;
        if (onRemove) {
            onRemove();
        }
        return prev - 1;
    });
}

return (
    <div className="dish-item">
    <img className="dish-image" src={image} alt={name} />
    <div className="dish-info">
        <h3 className="dish-name">
        {name}
        {spicy === true && <span className="spicy">🌶 Spicy</span>}
        </h3>
        <p className="dish-price">
        {price} {currency}
        </p>
    </div>

    <div className="dish-actions">
        <button type="button" onClick={handleAdd}>Add</button>
        <span>{count}</span>
        <button type="button" onClick={handleRemove} disabled={count === 0}>
        Remove
        </button>
    </div>
    </div>
);
}

Dish.defaultProps = {
currency: "ETB",
spicy: false,
image: "",
onAdd: null,
onRemove: null,
};

Dish.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string,
    spicy: PropTypes.bool,
    image: PropTypes.string,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
};

export default Dish;