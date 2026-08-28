import { useState } from "react";
import "./Main.css";
import Menu from "./Menu/Menu.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";

function Main() {
const [category, setCategory] = useState("All");

return (
    <main className="main">
    <Sidebar />
    <Menu category={category} onCategoryChange={setCategory} />
    </main>
);
}

export default Main;