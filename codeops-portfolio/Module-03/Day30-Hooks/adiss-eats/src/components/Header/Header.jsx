import { useContext } from "react";
import "./Header.css";
import { CartContext } from "../../cart/cartProvider.jsx";

const Header = () => {
    const { items, total } = useContext(CartContext);
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="head">
            <div className="header-spacer" aria-hidden="true" />
            <h1> Header </h1>
            <div className="cart">
                Cart: {totalCount} | Total: {total} ETB
            </div>
        </div>
    );
};

export default Header;