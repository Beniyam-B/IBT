import PropTypes from "prop-types";
import "./Dish.css";

function Dish({ name, price, currency, spicy, image }) {
return (
    <article className="dish">
    <img className="dish-image" src={image} alt={name} />
    <div className="dish-content">
        <div className="dish-title-row">
        <h3>{name}</h3>
        {spicy && <span className="dish-tag">Spicy</span>}
        </div>
        <p className="dish-price">
        {price} {currency}
        </p>
    </div>
    </article>
);
}

Dish.defaultProps = {
    currency: "ETB",
    spicy: false,
    image: "",
};

Dish.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string,
    spicy: PropTypes.bool,
    image: PropTypes.string,
};

export default Dish;