import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./cart/cartProvider.jsx";
import { AuthContext } from "./auth/RequireAuth.jsx";

function Checkout() {
    const { items, total, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

function placeOrder(e) {
    e.preventDefault();
    clearCart();
    navigate("/", { replace: true });
}

if (items.length === 0) return <p>Your cart is empty.</p>;

return (
    <div className="checkout-page">
        <h2>Checkout</h2>
        <p>Ordering as: {user.name} ({user.phone})</p>
    <ul>
        {items.map((item) => (
            <li key={item.id}>{item.name} × {item.quantity}</li>
        ))}
    </ul>
    <p>Total: {total} ETB</p>
    <form onSubmit={placeOrder}>
        <button type="submit">Place order</button>
    </form>
    </div>
);
}

export default Checkout;