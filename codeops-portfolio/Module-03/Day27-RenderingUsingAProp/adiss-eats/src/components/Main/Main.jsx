import Menu from "./Menu/Menu.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import "./Main.css";

function Main() {
return (
    <main className="main-layout">
        <Sidebar />
        <Menu />
    </main>
);
}

export default Main;