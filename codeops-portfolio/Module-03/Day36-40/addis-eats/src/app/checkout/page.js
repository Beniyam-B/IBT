import { redirect } from "next/navigation";
import { getDish, getSession } from "@/lib/db";
import CheckoutForm from "./CheckoutForm";
import ui from "@/components/ui.module.css";

export const metadata = { title: "Checkout · Addis Eats" };

// Dynamic on purpose: it reads the session cookie (the guard) and searchParams.
// Not signed in -> redirected to /login before anything renders.
export default async function CheckoutPage({ searchParams }) {
  const user = await getSession();
  if (!user) redirect("/login");

  // /checkout?dish=dish_1&qty=2 orders one dish without the cart. The form is then fully
  // rendered by the server, so it also works with JavaScript disabled.
  const { dish: dishId, qty } = await searchParams;
  let quick = null;
  if (dishId) {
    const dish = await getDish(dishId);
    if (dish) {
      const quantity = Math.min(20, Math.max(1, parseInt(qty ?? "1", 10) || 1));
      quick = { id: dish.id, name: dish.name, price: dish.price, quantity };
    }
  }

  return (
    <main>
      <div className={ui.pageHeader}>
        <h1>Checkout</h1>
        <p>Tell us where to reach you and we will start cooking.</p>
      </div>
      <CheckoutForm quick={quick} defaultName={user.name} defaultPhone={user.phone} />
    </main>
  );
}
