"use client";

import { useContext } from "react";
import { CartContext } from "../../providers";

export default function AddToCartButton({ dish }) {
  const { addItem } = useContext(CartContext);
  return <button onClick={() => addItem(dish)}>Add to cart</button>;
}