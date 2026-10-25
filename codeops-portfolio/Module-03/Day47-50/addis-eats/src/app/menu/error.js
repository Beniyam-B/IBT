"use client";

import ui from "@/components/ui.module.css";

// Must be a client component: it needs an event handler for the retry button.
export default function MenuError({ reset }) {
  return (
    <div className={`${ui.card} ${ui.empty}`}>
      <h2>Something went wrong loading the menu</h2>
      <p>Please try again.</p>
      <button type="button" className={`${ui.btn} ${ui.primary}`} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
