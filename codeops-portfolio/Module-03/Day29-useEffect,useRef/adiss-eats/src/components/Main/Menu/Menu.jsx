import { useEffect,useState } from "react";
import PropTypes from "prop-types";
import "./Menu.css";
import menu from "../../../data.js";
import Dish from "./Dish/Dish.jsx";
import Cards from "../../cards/cards.jsx";
import {loadDishes} from "../../../api.js";
import Sidebar from "../Sidebar/Sidebar.jsx";

const CATEGORIES = ["All", "Main", "Side", "Snack", "Breakfast", "Drink"];

function Menu({ category, onCategoryChange, onAddToCart, onRemoveFromCart }) {
  const [total, setTotal] = useState(0);
  const [dishes, setDishes] =useState([]);
  const [loading, setLoading] =useState(true);
  const [error, setError] =useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    loadDishes(category, ctrl.signal)
      .then(setDishes)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));
    
    return () => ctrl.abort();
  }, [category]);

  function handleAdd(price) {
    setTotal((prev) => prev + price);
    if (onAddToCart) {
      onAddToCart();
    }
  }

  function handleRemove() {
    if (onRemoveFromCart) {
      onRemoveFromCart();
    }
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
      {loading ? (
        <p className="menu-empty">Loading...</p>
      ) : error ? (
        <p className="menu-empty">Error: {error}</p>
      ) : dishes.length === 0 ? (
        <p className="menu-empty">No {category} dishes on the menu yet.</p>
      ) : (
        <div className="menu-grid">
          {dishes.map((dish) => (
            <Cards key={dish.id}>
              <Dish
                name={dish.name}
                price={dish.price}
                spicy={dish.spicy}
                image={dish.image}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            </Cards>
          ))}
        </div>
      )}
    </div>
  );
}
function Main({onAddToCart}) {
  const [category, setCategory] = useState("All");
  return (
    <main className="main">
      <Sidebar />
      <Menu category={category} onCategoryChange={setCategory} onAddToCart={onAddToCart} />
    </main>
  );
}


Menu.propTypes = {
  category: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func,
  onRemoveFromCart: PropTypes.func,
};

export default Menu;