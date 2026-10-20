"use client";

import ui from "@/components/ui.module.css";

// The error state: what failed, and a way to retry. Must be a client component (it has a
// button with a handler). The real message is not shown, because it can reveal internals.
export default function OrdersError({ reset }) {
  return (
    <div className={`${ui.card} ${ui.empty}`} role="alert">
      <h2>We could not load this page</h2>
      <p>Nothing was lost. Check your connection and try again.</p>
      <button type="button" className={`${ui.btn} ${ui.primary}`} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
