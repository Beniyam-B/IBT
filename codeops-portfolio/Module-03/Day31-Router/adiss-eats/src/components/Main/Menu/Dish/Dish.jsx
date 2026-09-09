import { useContext } from "react";
import PropTypes from "prop-types";
import "./Dish.css";
import { CartContext } from "../../../../cart/cartProvider.jsx";

function Dish({ id, name, price, currency, spicy, image, onAdd, onRemove }) {
  const { items } = useContext(CartContext);
  const count = items.find((item) => item.id === id)?.quantity ?? 0;

  function handleAdd() {
    if (onAdd) {
      onAdd({ id, name, price, spicy, image });
    }
  }

  function handleRemove() {
    if (count === 0) return;
    if (onRemove) {
      onRemove(id);
    }
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
        <button type="button" onClick={handleRemove} disabled={count === 0}>
          -
        </button>
        <span>{count}</span>
        <button type="button" onClick={handleAdd}>+</button>
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
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
  image: PropTypes.string,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Dish;