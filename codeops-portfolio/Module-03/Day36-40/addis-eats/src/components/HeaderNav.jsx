"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/app/providers";
import { logoutAction } from "@/app/actions";
import styles from "./Header.module.css";

// The one interactive island in the header: cart count + who is signed in.
export default function HeaderNav() {
  const { count } = useCart();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Ask the server who is signed in whenever the page changes.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
          setReady(true);
        }
      })
      .catch(() => setReady(true));
    return () => {
      cancelled = true;
    };
  }, [pathname]);

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
      <Link
        href="/cart"
        className={`${styles.navLink} ${pathname === "/cart" ? styles.active : ""}`}
      >
        Cart
        {count > 0 && <span className={styles.badge}>{count}</span>}
      </Link>
      {link("/checkout", "Checkout")}
      {user && link("/orders", "My orders")}

      <span className={styles.auth}>
        {ready && user && (
          <>
            <span className={styles.greeting}>Hi, {user.name.split(" ")[0]}</span>
            <form action={logoutAction}>
              <button type="submit" className={styles.ghostBtn}>
                Log out
              </button>
            </form>
          </>
        )}
        {ready && !user && (
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
