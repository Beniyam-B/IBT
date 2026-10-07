import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>Addis Eats</Link>
      <nav className={styles.nav}>
        <Link href="/menu" className={styles.navLink}>Menu</Link>
        <Link href="/cart" className={styles.navLink}>Cart</Link>
        <Link href="/checkout" className={styles.navLink}>Checkout</Link>
        <Link href="/login" className={styles.navLink}>Login</Link>
        <Link href="/register" className={styles.navLink}>Register</Link>
      </nav>
    </header>
  );
}