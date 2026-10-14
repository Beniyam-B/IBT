import Link from "next/link";
import HeaderNav from "./HeaderNav";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>A</span>
          Addis Eats
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
