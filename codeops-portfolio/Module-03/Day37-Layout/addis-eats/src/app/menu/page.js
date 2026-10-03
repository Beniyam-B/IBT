import { Suspense } from "react";
import DishList from "./DishList";

export const revalidate = 3600;

export default function MenuPage() {
  return (
    <main>
      <h1>Our menu</h1>
      <Suspense fallback={<p>Loading dishes...</p>}>
        <DishList />
      </Suspense>
    </main>
  );
}