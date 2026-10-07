import Link from "next/link";

export default function HomePage() {
  return (
    <main className="hero">
      <h1>Addis Eats</h1>
      <p>Ethiopian classics, made fresh in the heart of Addis Ababa.</p>
      <Link href="/menu" className="btn">View Menu</Link>
    </main>
  );
}