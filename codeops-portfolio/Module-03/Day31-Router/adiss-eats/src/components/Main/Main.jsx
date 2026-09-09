import { useState } from "react";
import PropTypes from "prop-types";
import "./Main.css";
import Menu from "./Menu/Menu.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";

function Main({ onAddToCart, onRemoveFromCart }) {
const [selectedCategories, setSelectedCategories] = useState([]);
const [spiceFilter, setSpiceFilter] = useState("All");
const [searchText, setSearchText] = useState("");

return (
    <main className="main">
    <Sidebar searchText={searchText} onSearchChange={setSearchText} />
    <Menu
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        spiceFilter={spiceFilter}
        onSpiceFilterChange={setSpiceFilter}
        searchText={searchText}
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