import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">Addis Eats</Link>
      <nav>
        <Link href="/menu">Menu</Link>
        <Link href="/cart">Cart</Link>
      </nav>
    </header>
  );
}