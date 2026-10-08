"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterShell({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    if ((searchParams.get("q") ?? "") === query) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("q", query);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `/menu?${qs}` : "/menu");
    }, 300);
    return () => clearTimeout(t);
  }, [query, router, searchParams]);

  return (
    <div>
      <input placeholder="Search dishes..." value={query} onChange={(e) => setQuery(e.target.value)} />
      {children}
    </div>
  );
}