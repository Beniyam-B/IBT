import { useState } from "react";
import "./Main.css";
import Menu from "./Menu/Menu.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";

function Main() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [spiceFilter, setSpiceFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  return (
    <main className="main">
      <aside className="main__sidebar">
        <Sidebar searchText={searchText} onSearchChange={setSearchText} />
      </aside>

      <div className="main__content">
        <Menu
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          spiceFilter={spiceFilter}
          onSpiceFilterChange={setSpiceFilter}
          searchText={searchText}
        />
      </div>
    </main>
  );
}

export default Main;