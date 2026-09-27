import { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCartStore } from "../../cart/cartStore.js";
import { AuthContext } from "../../auth/RequireAuth.jsx";

const navClass = ({ isActive }) => "site-header__link" + (isActive ? " site-header__link--active" : "");

const Header = () => {
  const totalQuantity = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="site-header">
      <span className="site-header__brand">Addis Eats</span>

      <nav className="site-header__nav">
        <NavLink to="/" className={navClass} end>
          <FontAwesomeIcon icon="fa-solid fa-house" /> Home
        </NavLink>
        <NavLink to="/menu" className={navClass}>
          <FontAwesomeIcon icon="fa-solid fa-utensils" /> Menu
        </NavLink>
        {user && <NavLink to="/checkout" className={navClass}>Checkout</NavLink>}
      </nav>

      <NavLink to="/cart" className="site-header__cart" aria-label={`Cart with ${totalQuantity} items`}>
        <FontAwesomeIcon icon="fa-solid fa-cart-shopping" />
        <span className="site-header__cart-count" aria-live="polite">{totalQuantity}</span>
      </NavLink>

      {user ? (
        <div className="site-header__user">
          <span className="site-header__greeting">Hi, {user.name}</span>
          <button type="button" className="site-header__logout" onClick={logout}>Log out</button>
        </div>
      ) : (
        <NavLink to="/login" className="site-header__link">Login</NavLink>
      )}
    </div>
  );
};

export default Header;