import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (dish) =>
        set((state) => {
          const dishId = String(dish.id);
          const existing = state.items.find((item) => String(item.id) === dishId);

          if (!existing) {
            return { items: [...state.items, { ...dish, id: dishId, quantity: 1 }] };
          }

          return {
            items: state.items.map((item) =>
              String(item.id) === dishId ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const itemId = String(id);
          const existing = state.items.find((item) => String(item.id) === itemId);
          if (!existing) return state;

          if (existing.quantity <= 1) {
            return { items: state.items.filter((item) => String(item.id) !== itemId) };
          }

          return {
            items: state.items.map((item) =>
              String(item.id) === itemId ? { ...item, quantity: item.quantity - 1 } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    { name: "addis-eats-cart" }
  )
);