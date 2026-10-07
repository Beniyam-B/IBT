"use client";

import { useActionState } from "react";
import { placeOrder } from "../actions";

export default function CheckoutPage() {
  const [state, formAction, pending] = useActionState(placeOrder, null);

  return (
    <main>
      <h1>Checkout</h1>
      <form action={formAction}>
        <input name="name" placeholder="Name" />
        {state?.fieldErrors?.name && <p role="alert">{state.fieldErrors.name[0]}</p>}

        <input name="phone" placeholder="Phone (09… or +2519…)" />
        {state?.fieldErrors?.phone && <p role="alert">{state.fieldErrors.phone[0]}</p>}

        <input name="dishId" placeholder="Dish ID" />
        <input name="quantity" type="number" defaultValue={1} />
        <textarea name="notes" placeholder="Notes (optional)" />

        <button disabled={pending}>{pending ? "Sending…" : "Place order"}</button>
      </form>

      {state?.id && <p>Order placed: {state.id}</p>}
    </main>
  );
}