import { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import "./Menu.css";
import Dish from "./Dish/Dish.jsx";
import Cards from "../../cards/cards.jsx";
import { useFetch } from "../../../hooks/useFetch.js";
import { CartContext } from "../../../cart/cartProvider.jsx";

const CATEGORIES = ["All", "Main", "Side", "Snack", "Breakfast", "Drink"];
const SPICE_OPTIONS = ["All", "Spicy", "Non-Spicy"];

function normalizeMenuItem(item) {
  const numericId = Number(String(item.id).replace(/\D/g, "")) || String(item.id);

  return {
    ...item,
    id: numericId,
    name: item.nameEn || item.name || "Dish",
    price: item.priceETB ?? item.price ?? 0,
    category: item.category || "Main",
    spicy: String(item.spiceLevel || "").toLowerCase().includes("hot") || String(item.spiceLevel || "").toLowerCase().includes("fiery") || Boolean(item.isSpicy),
    image: item.image || `https://images.unsplash.com/featured/?${encodeURIComponent(item.slug || item.nameEn || item.name || "ethiopian-food")}&auto=format&fit=crop&w=900&q=80`,
  };
}

function Menu({ selectedCategories, onCategoryChange, spiceFilter, onSpiceFilterChange, searchText }) {
  const { data, loading, error } = useFetch("https://addis-eats-backend.onrender.com/menu/");
  const { addItem, removeItem } = useContext(CartContext);

  const shown = useMemo(() => {
    const all = (data ?? []).map(normalizeMenuItem);
    const normalizedSearch = searchText.trim().toLowerCase();

    const categoryFiltered =
      selectedCategories.length === 0
        ? all
        : all.filter((d) => selectedCategories.includes(d.category));

    const spicyFiltered =
      spiceFilter === "All"
        ? categoryFiltered
        : categoryFiltered.filter((d) => (spiceFilter === "Spicy" ? d.spicy : !d.spicy));

    const searched =
      !normalizedSearch
        ? spicyFiltered
        : spicyFiltered.filter((dish) =>
            dish.name.toLowerCase().includes(normalizedSearch) ||
            dish.category.toLowerCase().includes(normalizedSearch)
          );

    return [...searched].sort((a, b) => a.price - b.price);
  }, [data, selectedCategories, spiceFilter, searchText]);

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
      <div className="menu-section__filters menu-section__filters--category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={
              cat === "All"
                ? selectedCategories.length === 0
                  ? "menu-section__button menu-section__button--active"
                  : "menu-section__button"
                : selectedCategories.includes(cat)
                  ? "menu-section__button menu-section__button--active"
                  : "menu-section__button"
            }
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-section__filters menu-section__filters--spice" aria-label="Spice filter">
        {SPICE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={
              spiceFilter === option
                ? "menu-section__button menu-section__button--active"
                : "menu-section__button"
            }
            onClick={() => handleSpiceClick(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="menu-section__empty">Loading the menu…</p>
      ) : error ? (
        <p className="menu-section__empty">{error}</p>
      ) : shown.length === 0 ? (
        <p className="menu-section__empty">No dishes match the current filters.</p>
      ) : (
        <div className="menu-section__grid">
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
  searchText: PropTypes.string.isRequired,
};

export default Menu;