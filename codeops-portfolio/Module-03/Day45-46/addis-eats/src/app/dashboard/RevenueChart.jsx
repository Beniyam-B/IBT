"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { etb } from "@/lib/format";
import styles from "./dashboard.module.css";

// Client leaf: a chart measures the DOM to size itself. The page stays a server component and
// passes in a handful of summarised rows. A bar axis starts at zero (the length IS the value),
// the unit is in every label, and each bar carries its number, so colour is not the only key.
export default function RevenueChart({ data }) {
  return (
    <div
      className={styles.chartBox}
      role="img"
      aria-label="Bar chart of revenue by delivery area, largest first. The same numbers are in the table below."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="area" />
          <YAxis tickFormatter={etb} width={90} domain={[0, "auto"]} />
          <Tooltip formatter={(value) => [etb(value), "Revenue"]} />
          <Bar dataKey="revenue" name="Revenue" fill="#b4441c">
            <LabelList dataKey="revenue" position="top" formatter={etb} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
