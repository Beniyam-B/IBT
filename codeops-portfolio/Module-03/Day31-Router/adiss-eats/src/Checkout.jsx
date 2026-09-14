import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartContext } from "./cart/cartProvider.jsx";
import { AuthContext } from "./auth/RequireAuth.jsx";

function Checkout() {
  const { items, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fulfillment, setFulfillment] = useState("delivery");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  function placeOrder(e) {
    e.preventDefault();
    if (fulfillment === "delivery" && !address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }
    setError("");
    setPlaced(true);
  }

  function closeSuccess() {
    clearCart();
    navigate("/", { replace: true });
  }

  if (items.length === 0 && !placed) return <p>Your cart is empty.</p>;

  return (
    <div className="checkout">
      <h2 className="checkout__title">Checkout</h2>
      <p className="checkout__user">Ordering as: {user.name} ({user.phone})</p>

      <ul className="checkout__items">
        {items.map((item) => (
          <li className="checkout__item" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price * item.quantity} ETB</span>
          </li>
        ))}
      </ul>
      <p className="checkout__total">Total: {total} ETB</p>

      <form onSubmit={placeOrder}>
        {error && <p className="auth-form__error">{error}</p>}

        <div className="checkout__fulfillment">
          <button
            type="button"
            className={"checkout__option" + (fulfillment === "delivery" ? " checkout__option--selected" : "")}
            onClick={() => setFulfillment("delivery")}
          >
            <FontAwesomeIcon icon="fa-solid fa-truck" /> Delivery
          </button>
          <button
            type="button"
            className={"checkout__option" + (fulfillment === "pickup" ? " checkout__option--selected" : "")}
            onClick={() => setFulfillment("pickup")}
          >
            <FontAwesomeIcon icon="fa-solid fa-store" /> Pickup
          </button>
        </div>

        {fulfillment === "delivery" && (
          <label className="checkout__field">
            Delivery address
            <input
              className="checkout__input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Bole, near Edna Mall…"
            />
          </label>
        )}

        <button type="submit" className="btn checkout__submit">Place order</button>
      </form>

      {placed && (
        <div className="order-success__backdrop">
          <div className="order-success__modal">
            <div className="order-success__icon">
              <FontAwesomeIcon icon="fa-solid fa-circle-check" size="2x" />
            </div>
            <p className="order-success__message">
              Order placed successfully!{" "}
              {fulfillment === "delivery" ? "It's on its way to you." : "Ready for pickup shortly."}
            </p>
            <button type="button" className="btn" onClick={closeSuccess}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;