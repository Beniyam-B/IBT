import { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import "./Menu.css";
import Dish from "./Dish/Dish.jsx";
import Cards from "../../cards/cards.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { CartContext } from "../../../cart/cartProvider.jsx";

const CATEGORIES = ["All", "Main", "Side", "Snack", "Breakfast", "Drink"];
const SPICE_OPTIONS = ["All", "Spicy", "Non-Spicy"];

function Menu({ selectedCategories, onCategoryChange, spiceFilter, onSpiceFilterChange }) {
  const { data, loading, error } = useFetch("/dishes.json");
  const { addItem, removeItem } = useContext(CartContext);

  const shown = useMemo(() => {
    const all = data ?? [];
    const categoryFiltered =
      selectedCategories.length === 0
        ? all
        : all.filter((d) => selectedCategories.includes(d.category));
    const spicyFiltered =
      spiceFilter === "All"
        ? categoryFiltered
        : categoryFiltered.filter((d) => (spiceFilter === "Spicy" ? d.spicy : !d.spicy));

    return [...spicyFiltered].sort((a, b) => a.price - b.price);
  }, [data, selectedCategories, spiceFilter]);

  const handleCategoryClick = (cat) => {
    if (cat === "All") {
      onCategoryChange([]);
      return;
    }

    onCategoryChange((current) =>
      current.includes(cat) ? current.filter((item) => item !== cat) : [...current, cat]
    );
  };

  const handleSpiceClick = (value) => {
    onSpiceFilterChange((current) => (current === value ? "All" : value));
  };

  return (
    <div className="menu-section">
      <div className="menu-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={cat === "All" ? (selectedCategories.length === 0 ? "menu-button active" : "menu-button") : selectedCategories.includes(cat) ? "menu-button active" : "menu-button"}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-spice-filter" aria-label="Spice filter">
        {SPICE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={spiceFilter === option ? "spice-button active" : "spice-button"}
            onClick={() => handleSpiceClick(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="menu-empty">Loading the menu…</p>
      ) : error ? (
        <p className="menu-empty">{error}</p>
      ) : shown.length === 0 ? (
        <p className="menu-empty">No dishes match the current filters.</p>
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
                onRemove={removeItem}
              />
            </Cards>
          ))}
        </div>
      )}
    </div>
  );
}

Menu.propTypes = {
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  spiceFilter: PropTypes.string.isRequired,
  onSpiceFilterChange: PropTypes.func.isRequired,
};

export default Menu;