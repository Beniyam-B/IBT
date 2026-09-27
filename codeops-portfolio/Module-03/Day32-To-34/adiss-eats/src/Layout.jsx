import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function Layout() {
const location = useLocation();
const isMenuPage = location.pathname === "/menu" || location.pathname.startsWith("/menu/");

return (
    <div className="app-shell">
    <Header />
    <div className={isMenuPage ? "page-content menu-page" : "page-content"}>
        <Outlet />
    </div>
    <Footer />
    </div>
);
}

export default Layout;