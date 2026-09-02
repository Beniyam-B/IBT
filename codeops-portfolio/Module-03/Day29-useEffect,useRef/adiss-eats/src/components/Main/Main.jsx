import { useState } from "react";
import PropTypes from "prop-types";
import "./Main.css";
import Menu from "./Menu/Menu.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";

function Main({ onAddToCart, onRemoveFromCart }) {
const [category, setCategory] = useState("All");

return (
    <main className="main">
    <Sidebar />
    <Menu
        category={category}
        onCategoryChange={setCategory}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
    />
    </main>
);
}

Main.propTypes = {
    onAddToCart: PropTypes.func,
    onRemoveFromCart: PropTypes.func,
};

export default Main;