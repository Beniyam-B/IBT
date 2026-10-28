"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { placeOrder } from "../actions";
import { useCart } from "../providers";
import { AREAS } from "@/lib/areas";
import ui from "@/components/ui.module.css";
import styles from "./checkout.module.css";
import areaStyles from "./area.module.css";

// Client leaf: useActionState is a hook. The checks themselves (session, schema, prices)
// all run inside the placeOrder server action.
export default function CheckoutForm({ quick, defaultName, defaultPhone }) {
  const { items, clear } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, null);

  // One key per page load. Made after mount so the server and browser HTML match.
  const [key, setKey] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setKey(crypto.randomUUID()), 0);
    return () => clearTimeout(t);
  }, []);

  const lines = quick ? [quick] : items;
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const cartPayload = JSON.stringify(lines.map((l) => ({ dishId: l.id, quantity: l.quantity })));

  useEffect(() => {
    if (state?.id && !quick) clear();
  }, [state?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state?.id) {
    return (
      <div className={`${ui.card} ${ui.empty}`}>
        <h2>Order placed 🎉</h2>
        <p>
          Your order number is <strong>{state.id}</strong>. Total: <strong>{state.total} ETB</strong>.
        </p>
        <Link href="/orders" className={`${ui.btn} ${ui.primary}`}>View my orders</Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className={`${ui.card} ${ui.empty}`}>
        <h2>Nothing to check out yet</h2>
        <p>Your cart is empty.</p>
        <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>Browse the menu</Link>
      </div>
    );
  }

  const errors = state?.fieldErrors ?? {};

  return (
    <div className={styles.layout}>
      <form action={formAction} className={`${ui.card} ${styles.form}`} noValidate>
        {state?.error && (
          <p className={ui.alert} role="alert">
            {state.error} {state.error.includes("log in") && <Link href="/login">Log in</Link>}
          </p>
        )}

        <input type="hidden" name="items" value={cartPayload} />
        <input type="hidden" name="key" value={key} />

        <div className={ui.field}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            defaultValue={state?.values?.name ?? defaultName}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className={ui.fieldError} role="alert">{errors.name[0]}</p>}
        </div>

        <div className={ui.field}>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="09… or +2519…"
            autoComplete="tel"
            defaultValue={state?.values?.phone ?? defaultPhone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && <p id="phone-error" className={ui.fieldError} role="alert">{errors.phone[0]}</p>}
        </div>

        <div className={ui.field}>
          <label htmlFor="area">Delivery area</label>
          <select
            id="area"
            name="area"
            className={areaStyles.select}
            defaultValue={state?.values?.area ?? ""}
            aria-invalid={Boolean(errors.area)}
            aria-describedby={errors.area ? "area-error" : undefined}
          >
            <option value="" disabled>Choose your area…</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          {errors.area && <p id="area-error" className={ui.fieldError} role="alert">{errors.area[0]}</p>}
        </div>

        <div className={ui.field}>
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Less spicy, extra injera…"
            defaultValue={state?.values?.notes ?? ""}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? "notes-error" : undefined}
          />
          {errors.notes && <p id="notes-error" className={ui.fieldError} role="alert">{errors.notes[0]}</p>}
        </div>

        <button type="submit" disabled={pending} className={`${ui.btn} ${ui.primary}`}>
          {pending ? "Placing order…" : `Place order · ${total} ETB`}
        </button>
      </form>

      <aside className={`${ui.card} ${styles.summary}`}>
        <h2>Your order</h2>
        <ul className={styles.lines}>
          {lines.map((l) => (
            <li key={l.id}>
              <span>{l.quantity} × {l.name}</span>
              <span>{l.price * l.quantity} ETB</span>
            </li>
          ))}
        </ul>
        <div className={styles.total}>
          <span>Total</span>
          <span>{total} ETB</span>
        </div>
        {!quick && <Link href="/cart">Edit cart</Link>}
      </aside>
    </div>
  );
}