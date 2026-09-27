import PropTypes from "prop-types";
import "./Dish.css";
import { useCartStore } from "../../../../cart/cartStore.js";

function Dish({ id, name, price, currency, spicy, image, onAdd, onRemove }) {
  const count = useCartStore(
    (s) => s.items.find((item) => String(item.id) === String(id))?.quantity ?? 0
  );

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
    <article className="dish-card">
      <img className="dish-card__image" src={image} alt={name} />

      <div className="dish-card__info">
        <h3 className="dish-card__name">
          {name}
          {spicy === true && <span className="dish-card__spicy">🌶 Spicy</span>}
        </h3>
        <p className="dish-card__price">
          {price} {currency}
        </p>
      </div>

      <div className="dish-card__actions">
        <button
          type="button"
          className="dish-card__button dish-card__button--remove"
          onClick={handleRemove}
          disabled={count === 0}
          aria-label={`Remove one ${name}`}
        >
          -
        </button>
        <span className="dish-card__count">{count}</span>
        <button
          type="button"
          className="dish-card__button dish-card__button--add"
          onClick={handleAdd}
          aria-label={`Add one ${name}`}
        >
          +
        </button>
      </div>
    </article>
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