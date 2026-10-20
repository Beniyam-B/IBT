"use client";

import ui from "@/components/ui.module.css";

// The error state: what failed, and a way to retry. Must be a client component (it has a
// button with a handler). The real message is not shown, because it can reveal internals.
export default function DashboardError({ reset }) {
  return (
    <main>
    <div className={`${ui.card} ${ui.empty}`} role="alert">
      <h2>We could not load the dashboard</h2>
      <p>The numbers could not be read. Try again in a moment.</p>
      <button type="button" className={`${ui.btn} ${ui.primary}`} onClick={() => reset()}>
        Try again
      </button>
    </div>
    </main>
  );
}
