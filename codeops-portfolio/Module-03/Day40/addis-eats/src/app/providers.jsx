"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}

const STORAGE_KEY = "addis-eats-cart";

export function Providers({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load after mount (not during render) so server and browser HTML match.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

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
      count: items.length, // distinct dishes, not total quantity
      quantity: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
