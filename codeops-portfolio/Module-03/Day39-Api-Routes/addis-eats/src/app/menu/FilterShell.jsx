"use client";

import { useState } from "react";

export default function FilterShell({ children }) {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input
        placeholder="Search dishes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>{children}</div>
    </div>
  );
}