import { useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import "./Menu.css";
import Dish from "./Dish/Dish.jsx";
import Cards from "../../cards/cards.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { CartContext } from "../../../cart/cartProvider.jsx";

const CATEGORIES = ["All", "Main", "Side", "Snack", "Breakfast", "Drink"];

function Menu({ category, onCategoryChange }) {
  const { data, loading, error } = useFetch("/dishes.json");
  const { addItem } = useContext(CartContext);

  const shown = useMemo(() => {
    const all = data ?? [];
    const filtered = category === "All" ? all : all.filter((d) => d.category === category);
    return [...filtered].sort((a, b) => a.price - b.price);
  }, [data, category]);

  useEffect(() => {
    document.title = `Addis Eats — ${shown.length} items`;
  }, [shown.length]);

  return (
    <div className="menu-section">
      <div className="menu-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={cat === category ? "menu-button active" : "menu-button"}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="menu-empty">Loading the menu…</p>
      ) : error ? (
        <p className="menu-empty">{error}</p>
      ) : shown.length === 0 ? (
        <p className="menu-empty">No {category} dishes on the menu yet.</p>
      ) : (
        <div className="menu-grid">
          {shown.map((dish) => (
            <Cards key={dish.id}>
              <Dish
                id={dish.id}
                name={dish.name}
                price={dish.price}
                spicy={dish.spicy}
                image={dish.image}
                onAdd={addItem}
              />
            </Cards>
          ))}
        </div>
      )}
    </div>
  );
}

Menu.propTypes = {
  category: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

export default Menu;