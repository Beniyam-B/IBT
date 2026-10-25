import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <strong>Addis Eats</strong>
          <p>Ethiopian comfort food, from our kitchen to your door.</p>
        </div>
        <div>
          <h2 className={styles.heading}>Explore</h2>
          <ul className={styles.list}>
            <li><Link href="/menu">Menu</Link></li>
          </ul>
        </div>
        <div>
          <h2 className={styles.heading}>Account</h2>
          <ul className={styles.list}>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </div>
        <div>
          <h2 className={styles.heading}>Visit us</h2>
          <ul className={styles.list}>
            <li>Bole, Addis Ababa</li>
            <li>Open daily, 8:00 – 22:00</li>
          </ul>
        </div>
      </div>
      <p className={styles.copy}>&copy; 2026 Addis Eats. All rights reserved.</p>
    </footer>
  );
}
