import { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { CartContext } from "../../cart/cartProvider.jsx";
import { AuthContext } from "../../auth/RequireAuth.jsx";

const navStyle = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

const Header = () => {
    const { totalQuantity } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);

return (
    <div className="head">
    <h1>Addis Eats</h1>

    <div className="nav-group">
        <nav className="main-nav">
            <NavLink to="/" className={navStyle} end>Home</NavLink>
            <NavLink to="/menu" className={navStyle}>Menu</NavLink>
            {user ? (
            <>
                <NavLink to="/checkout" className={navStyle}>Checkout</NavLink>
                <span className="user-greeting">Hi, {user.name}</span>
                <button type="button" onClick={logout}>Log out</button>
            </>
            ) : (
                <NavLink to="/login" className={navStyle}>Login / Register</NavLink>
            )}
        </nav>

        <NavLink to="/cart" className="nav-link cart-link">Cart ({totalQuantity})</NavLink>
    </div>
    </div>
);
};

export default Header;