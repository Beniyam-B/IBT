"use client";

import { createContext, useState } from "react";

export const CartContext = createContext(null);

export function Providers({ children }) {
  const [items, setItems] = useState([]);

  function addItem(dish) {
    setItems((prev) => [...prev, dish]);
  }

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
}