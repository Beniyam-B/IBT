import { createContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import { cartReducer } from "./cartReducer.js";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const total = state.items.reduce((sum, d) => sum + d.price, 0);

  function addItem(dish) {
    dispatch({ type: "add", dish });
  }
  function removeItem(id) {
    dispatch({ type: "remove", id });
  }
  function clearCart() {
    dispatch({ type: "clear" });
  }

  const value = useMemo(
    () => ({ items: state.items, total, addItem, removeItem, clearCart }),
    [state.items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};