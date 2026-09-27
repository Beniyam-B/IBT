import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCartStore } from "./cart/cartStore.js";
import { AuthContext } from "./auth/RequireAuth.jsx";
import Field from "./checkout/Field.jsx";
import { validate, AREAS } from "./checkout/validate.js";
import Modal from "./ui/Modal.jsx";

function Checkout() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const clearCart = useCartStore((s) => s.clearCart);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    area: AREAS[0],
    address: "",
    notes: "",
  });
  const [fulfillment, setFulfillment] = useState("delivery");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const errors = validate(form, fulfillment);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setTouched({ name: true, phone: true, area: true, address: true, notes: true });

    if (Object.keys(errors).length > 0) {
      document.getElementById(Object.keys(errors)[0])?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPlaced(true);
    } finally {
      setSubmitting(false);
    }
  }

  function closeSuccess() {
    clearCart();
    navigate("/", { replace: true });
  }

  if (items.length === 0 && !placed) return <p>Your cart is empty.</p>;

  return (
    <div className="checkout">
      <h2 className="checkout__title">Checkout</h2>

      <ul className="checkout__items">
        {items.map((item) => (
          <li className="checkout__item" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price * item.quantity} ETB</span>
          </li>
        ))}
      </ul>
      <p className="checkout__total">Total: {total} ETB</p>

      <form onSubmit={handleSubmit} noValidate>
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

        <Field
          id="name" label="Name" name="name"
          value={form.name} onChange={handleChange} onBlur={handleBlur}
          error={errors.name} touched={touched.name}
        />

        <Field
          id="phone" label="TeleBirr phone" name="phone" type="tel" placeholder="09… or +2519…"
          value={form.phone} onChange={handleChange} onBlur={handleBlur}
          error={errors.phone} touched={touched.phone}
        />

        {fulfillment === "delivery" && (
          <>
            <Field
              id="area" label="Delivery area" name="area" as="select"
              value={form.area} onChange={handleChange} onBlur={handleBlur}
              error={errors.area} touched={touched.area}
            >
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </Field>

            <Field
              id="address" label="Delivery address" name="address" placeholder="Bole, near Edna Mall…"
              value={form.address} onChange={handleChange} onBlur={handleBlur}
              error={errors.address} touched={touched.address}
            />
          </>
        )}

        <Field
          id="notes" label="Notes (optional)" name="notes" as="textarea"
          value={form.notes} onChange={handleChange} onBlur={handleBlur}
          error={errors.notes} touched={touched.notes}
        />

        <button type="submit" className="btn checkout__submit" disabled={submitting}>
          {submitting ? "Sending your order…" : `Order — ${total} ETB`}
        </button>
      </form>

      {placed && (
        <Modal onClose={closeSuccess} labelledBy="order-success-title">
          <div className="order-success">
            <div className="order-success__icon">
              <FontAwesomeIcon icon="fa-solid fa-circle-check" size="2x" />
            </div>
            <h3 id="order-success-title" className="order-success__message">
              Order placed successfully!{" "}
              {fulfillment === "delivery" ? "It's on its way to you." : "Ready for pickup shortly."}
            </h3>
            <button type="button" className="btn" onClick={closeSuccess}>Done</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Checkout;