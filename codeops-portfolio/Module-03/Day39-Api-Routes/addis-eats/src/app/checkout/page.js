// Dynamic: reads the session cookie for the logged-in user's cart
// and live pricing, so this route can't be prebuilt.
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <main>
      <h1>Checkout</h1>
    </main>
  );
}