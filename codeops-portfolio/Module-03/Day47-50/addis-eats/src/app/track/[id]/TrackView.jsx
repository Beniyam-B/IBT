"use client";

import { useEffect, useState } from "react";
import { relative } from "@/lib/format";
import ui from "@/components/ui.module.css";
import MapPanel from "./MapPanel";
import styles from "./track.module.css";

const DONE = ["DELIVERED", "CANCELLED"];
const PROGRESS = { PENDING: 0, PREPARING: 0, "ON THE WAY": 0.6, DELIVERED: 1, CANCELLED: 0 };
const STATUS_WORDS = {
  PENDING: "Order received. The kitchen has not started yet.",
  PREPARING: "The kitchen is preparing your food.",
  "ON THE WAY": "The courier has left the kitchen and is on the way.",
  DELIVERED: "Delivered. Enjoy your meal.",
  CANCELLED: "This order was cancelled.",
};
const COURIER_WORDS = {
  PENDING: "Waiting at the kitchen",
  PREPARING: "Waiting at the kitchen",
  "ON THE WAY": "On the road, about 60% of the way",
  DELIVERED: "At your address",
  CANCELLED: "Not dispatched",
};
const CONNECTION = {
  connecting: "Connecting…",
  live: "Live",
  reconnecting: "Reconnecting…",
  closed: "Updates finished",
  offline: "Offline. Reload the page to try again.",
};
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export default function TrackView({ id, initialStatus, area, totalLabel, placedAt, kitchen, destination }) {
  const [status, setStatus] = useState(initialStatus);
  const [connection, setConnection] = useState(DONE.includes(initialStatus) ? "closed" : "connecting");
  const [now, setNow] = useState(null);

 useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0); // set from a callback, not directly in the effect body
    const clock = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    if (DONE.includes(initialStatus)) return;
    const es = new EventSource(`/api/orders/${id}/stream`);
    es.onopen = () => setConnection("live");
    es.onmessage = (event) => {
      const next = JSON.parse(event.data).status;
      setStatus(next);
      if (DONE.includes(next)) {
        es.close();
        setConnection("closed");
      }
    };
    es.onerror = () => setConnection(es.readyState === EventSource.CLOSED ? "offline" : "reconnecting");
    return () => es.close();
  }, [id, initialStatus]);

  const courier = lerp(kitchen, destination, PROGRESS[status] ?? 0);

  return (
    <div className={styles.layout}>
      <MapPanel kitchen={kitchen} courier={courier} destination={destination} />
      <section className={ui.card} aria-labelledby="status-heading">
        <h2 id="status-heading">Order status</h2>
        <p role="status" aria-live="polite" className={styles.status}>
          {status}: {STATUS_WORDS[status]}
        </p>
        <p className={styles.badge}>Connection: {CONNECTION[connection]}</p>
        <dl className={styles.facts}>
          <div><dt>Delivering to</dt><dd>{area ?? "Area not given"}, Addis Ababa</dd></div>
          <div><dt>From</dt><dd>Addis Eats kitchen, Meskel Square</dd></div>
          <div><dt>Courier</dt><dd>{COURIER_WORDS[status]}</dd></div>
          <div><dt>Total</dt><dd>{totalLabel}</dd></div>
          <div><dt>Placed</dt><dd>{now ? relative(placedAt, now) : "…"}</dd></div>
        </dl>
      </section>
    </div>
  );
}