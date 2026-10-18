"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ui from "@/components/ui.module.css";
import styles from "./orders.module.css";

const STEPS = ["PENDING", "PREPARING", "ON THE WAY", "DELIVERED"];
const FINISHED = ["DELIVERED", "CANCELLED"];

// Client leaf: polls the order every 5 seconds until it is delivered or cancelled.
// `initial` is the order the server already rendered, so the first paint has real data
// and there is no loading state.
export default function OrderStatus({ id, initial }) {
  const { data: order, error, isValidating } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: initial,
    refreshInterval: (latest) => (FINISHED.includes(latest?.status) ? 0 : 5000),
  });

  const finished = FINISHED.includes(order.status);
  const stepIndex = STEPS.indexOf(order.status);

  return (
    <div className={`${ui.card} ${styles.tracker}`}>
      {error && (
        <p className={ui.alert} role="alert">
          {error.status === 401
            ? "You were signed out. Log in again to keep tracking this order."
            : "We could not refresh this order. Showing the last update."}
        </p>
      )}

      {order.status === "CANCELLED" ? (
        <p className={ui.alert}>This order was cancelled.</p>
      ) : (
        <ol className={styles.steps} aria-label="Order progress">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className={`${styles.step} ${i <= stepIndex ? styles.stepDone : ""} ${i === stepIndex ? styles.stepNow : ""}`}
              aria-current={i === stepIndex ? "step" : undefined}
            >
              {step}
            </li>
          ))}
        </ol>
      )}

      <p className={styles.live} aria-live="polite">
        <span className={`${styles.dot} ${finished ? styles.dotOff : ""}`} />
        {finished
          ? "This order will not change any more."
          : isValidating
            ? "Checking for updates…"
            : "Live: updating every 5 seconds."}
      </p>

      <ul className={styles.lines}>
        {(order.items ?? []).map((i) => (
          <li key={i.dishId}>
            <span>{i.quantity} × {i.name}</span>
            <span>{i.price * i.quantity} ETB</span>
          </li>
        ))}
      </ul>
      <div className={styles.foot}>
        <span>Order {order.id}</span>
        <strong>{order.total} {order.currency}</strong>
      </div>
    </div>
  );
}
