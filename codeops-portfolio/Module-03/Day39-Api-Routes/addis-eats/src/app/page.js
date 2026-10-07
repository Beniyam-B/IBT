import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Addis Eats</h1>
      <Link href="/menu">View Menu</Link>
    </main>
  );
}