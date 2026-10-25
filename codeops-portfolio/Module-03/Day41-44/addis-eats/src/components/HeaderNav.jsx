"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/providers";
import { logoutAction } from "@/app/actions";
import styles from "./Header.module.css";

// The one interactive island in the header. Cart, checkout and orders only exist for people
// who are signed in. Hiding a link is interface only: the proxy, the pages and the actions
// are what actually protect those routes.
export default function HeaderNav() {
  const { count, user, sessionReady, clear } = useCart();
  const pathname = usePathname();

  const link = (href, label) => (
    <Link
      href={href}
      className={`${styles.navLink} ${pathname === href ? styles.active : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className={styles.nav} aria-label="Main">
      {link("/menu", "Menu")}

      {sessionReady && user && (
        <>
          <Link
            href="/cart"
            className={`${styles.navLink} ${pathname === "/cart" ? styles.active : ""}`}
          >
            Cart
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </Link>
          {link("/checkout", "Checkout")}
          {link("/orders", "My orders")}
          {user.role === "staff" && link("/kitchen", "Kitchen")}
        </>
      )}

      <span className={styles.auth}>
        {sessionReady && user && (
          <>
            <span className={styles.greeting}>Hi, {user.name.split(" ")[0]}</span>
            {/* the cart belongs to this person: empty it before the next one uses this browser */}
            <form action={logoutAction} onSubmit={clear}>
              <button type="submit" className={styles.ghostBtn}>
                Log out
              </button>
            </form>
          </>
        )}
        {sessionReady && !user && (
          <>
            <Link href="/login" className={styles.navLink}>
              Login
            </Link>
            <Link href="/register" className={styles.registerBtn}>
              Register
            </Link>
          </>
        )}
      </span>
    </nav>
  );
}
