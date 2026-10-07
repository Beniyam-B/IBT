import { Suspense } from "react";
import FilterShell from "./FilterShell";
import DishList from "./DishList";

export default async function MenuPage({ searchParams }) {
  const { q = "", category = "all" } = await searchParams;

  return (
    <main>
      <h1>Our menu</h1>
      <FilterShell>
        <Suspense key={`${q}-${category}`} fallback={<p>Loading dishes...</p>}>
          <DishList query={q} category={category} />
        </Suspense>
      </FilterShell>
    </main>
  );
}