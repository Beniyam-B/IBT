import CartView from "./CartView";

export const metadata = { title: "Your cart · Addis Eats" };

// Server component: just the heading. The cart itself lives in the browser (CartView).
export default function CartPage() {
  return (
    <main>
      <h1>Your cart</h1>
      <CartView />
    </main>
  );
}
