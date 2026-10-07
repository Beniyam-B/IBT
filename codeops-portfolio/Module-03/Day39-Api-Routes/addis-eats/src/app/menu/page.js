import { Suspense } from "react";
import FilterShell from "./FilterShell";
import DishList from "./DishList";

export const revalidate = 3600;

export default function MenuPage() {
  return (
    <main>
      <h1>Our menu</h1>
      <FilterShell>
        <Suspense fallback={<p>Loading dishes...</p>}>
          <DishList />
        </Suspense>
      </FilterShell>
    </main>
  );
}