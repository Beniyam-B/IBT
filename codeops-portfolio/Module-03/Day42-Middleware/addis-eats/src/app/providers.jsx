"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}

const STORAGE_KEY = "addis-eats-cart";

export function Providers({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // Who is signed in: one fetch here, shared with the header and every Add-to-cart button.
  // It is asked again whenever the page changes, because signing in or out changes the answer.
  // (A plain fetch, not SWR: SWR here would be loaded by every single route.)
  const pathname = usePathname();
  const [session, setSession] = useState({ user: null, ready: false });
  useEffect(() => {
    let cancelled = false;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSession({ user: data.user, ready: true });
      })
      .catch(() => {
        if (!cancelled) setSession((prev) => ({ ...prev, ready: true }));
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    function addItem(dish) {
      setItems((prev) => {
        const found = prev.find((i) => i.id === dish.id);
        if (found) {
          return prev.map((i) => (i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...prev, { ...dish, quantity: 1 }];
      });
    }
    function decrease(id) {
      setItems((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0)
      );
    }
    function removeItem(id) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
    function clear() {
      setItems([]);
    }
    return {
      items,
      addItem,
      decrease,
      removeItem,
      clear,
      user: session.user,
      sessionReady: session.ready,
      count: items.length, // distinct dishes, not total quantity
      quantity: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
  }, [items, session]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
