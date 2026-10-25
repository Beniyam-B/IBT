"use client";

import { useState } from "react";
import { download } from "@/lib/csv";
import ui from "@/components/ui.module.css";

export default function ExportButton() {
  const [state, setState] = useState("idle");

  async function onClick() {
    setState("working");
    try {
      const res = await fetch("/api/orders/export");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      download(await res.text(), "addis-eats-orders.csv");
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <button type="button" onClick={onClick} disabled={state === "working"} className={`${ui.btn} ${ui.outline}`}>
        {state === "working" ? "Preparing…" : "Export CSV"}
      </button>
      <span role="status">{state === "error" ? " The export failed. Try again." : ""}</span>
    </div>
  );
}