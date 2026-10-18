import Link from "next/link";
import { db } from "@/lib/db";
import DishImage from "@/components/DishImage";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import ui from "@/components/ui.module.css";
import styles from "./page.module.css";

export const metadata = { alternates: { canonical: "/" } }; // title and description come from the root layout

// No cookies, no searchParams: the home page is built once and served as static HTML.
export default async function HomePage() {
  const dishes = await db.dish.findMany();
  const popular = dishes.slice(0, 3);

  // Only facts the page itself shows. No invented address or phone number.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Ethiopian comfort food, from our kitchen to your door.",
    servesCuisine: "Ethiopian",
    areaServed: { "@type": "City", name: "Addis Ababa" },
    ...(popular[0]?.image ? { image: `${SITE_URL}${popular[0].image}` } : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Fresh from Addis Ababa</span>
          <h1 className={styles.title}>Ethiopian comfort food, delivered.</h1>
          <p className={styles.tagline}>
            Slow-cooked wats, spiced kitfo and generous fasting platters, made the way home tastes.
          </p>
          <div className={styles.actions}>
            <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>View Menu</Link>
            <Link href="/register" className={`${ui.btn} ${ui.outline}`}>Create an account</Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <DishImage
            src={popular[0].image}
            alt={popular[0].name}
            className={styles.heroPhoto}
            sizes="(max-width: 800px) 100vw, 480px"
            preload
          />
        </div>
      </section>

      <main className={styles.main}>
        <section className={styles.features} aria-label="Why Addis Eats">
          <div className={styles.feature}>
            <strong>Made fresh</strong>
            <span>Cooked to order, never reheated.</span>
          </div>
          <div className={styles.feature}>
            <strong>Fasting friendly</strong>
            <span>Plenty of vegan dishes every day.</span>
          </div>
          <div className={styles.feature}>
            <strong>Easy ordering</strong>
            <span>Add to cart, check out in a minute.</span>
          </div>
        </section>

        <section>
          <div className={styles.sectionHead}>
            <h2>Popular right now</h2>
            <Link href="/menu">See the full menu →</Link>
          </div>
          <ul className={styles.popular}>
            {popular.map((dish) => (
              <li key={dish.id} className={styles.popCard}>
                <Link href={`/menu/${dish.id}`}>
                  <DishImage src={dish.image} alt={dish.name} sizes="(max-width: 720px) 100vw, 340px" />
                  <div className={styles.popBody}>
                    <strong>{dish.name}</strong>
                    <span>{dish.price} {dish.currency}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.steps}>
          <h2>How it works</h2>
          <ol className={styles.stepList}>
            <li><span>1</span> Browse the menu and add your favourites.</li>
            <li><span>2</span> Review your cart and check out.</li>
            <li><span>3</span> Track or cancel your order any time from My orders.</li>
          </ol>
        </section>
      </main>
    </>
  );
}
