import { useState } from "react";
import PropTypes from "prop-types";
import "./Main.css";
import Menu from "./Menu/Menu.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";

function Main({ onAddToCart, onRemoveFromCart }) {
const [selectedCategories, setSelectedCategories] = useState([]);
const [spiceFilter, setSpiceFilter] = useState("All");

return (
    <main className="main">
    <Sidebar />
    <Menu
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        spiceFilter={spiceFilter}
        onSpiceFilterChange={setSpiceFilter}
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