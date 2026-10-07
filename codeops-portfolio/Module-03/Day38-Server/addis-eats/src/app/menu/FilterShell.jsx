"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function FilterShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === (params.get("q") ?? "")) return;
      const next = new URLSearchParams(params.toString());
      if (query) next.set("q", query);
      else next.delete("q");
      router.replace(`${pathname}?${next.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, params, pathname, router]);

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