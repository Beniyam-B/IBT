import { useState } from "react";
import PropTypes from "prop-types";
import "./Menu.css";
import menu from "../../../data.js";
import Dish from "./Dish/Dish.jsx";
import Cards from "../../cards/cards.jsx";

const CATEGORIES = ["All", "Main", "Side", "Snack", "Breakfast", "Drink"];

function Menu({ category, onCategoryChange }) {
  const [total, setTotal] = useState(0);

  const shown =
    category === "All"
      ? menu
      : menu.filter((d) => d.category === category);

  function handleAdd(price) {
    setTotal((prev) => prev + price);
  }

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

      {shown.length === 0 ? (
        <p className="menu-empty">No {category} dishes on the menu yet.</p>
      ) : (
        <div className="menu-grid">
          {shown.map((dish) => (
            <Cards key={dish.id}>
              <Dish
                name={dish.name}
                price={dish.price}
                spicy={dish.spicy}
                image={dish.image}
                onAdd={handleAdd}
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