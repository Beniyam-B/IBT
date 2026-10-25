"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./dashboard.module.css";

// A line answers "how has it changed?". Whole numbers only, and the unit is on the axis.
export default function OrdersChart({ data }) {
  return (
    <div
      className={styles.chartBox}
      role="img"
      aria-label="Line chart of orders placed per day. The same numbers are in the table below."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" interval="preserveStartEnd" minTickGap={16} />
          <YAxis allowDecimals={false} domain={[0, "auto"]} width={48} label={{ value: "Orders", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [value, "Orders"]} />
          <Line type="monotone" dataKey="orders" name="Orders" stroke="#b4441c" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
