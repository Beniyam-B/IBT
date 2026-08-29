import menu from "../../../data.js";
import Dish from "./Dish/Dish.jsx";
import Cards from "../../cards/cards.jsx";
import "./Menu.css";

function Menu() {
  return (
    <section className="menu-section">
      <div className="menu-header">
        <h2>Full Menu</h2>
      </div>

      <div className="menu-grid">
        {menu.map((dish) => (
          <Cards key={dish.id}>
            <Dish
              name={dish.name}
              price={dish.price}
              spicy={dish.spicy}
              image={dish.image}
            />
          </Cards>
        ))}
      </div>
    </section>
  );
}

export default Menu;