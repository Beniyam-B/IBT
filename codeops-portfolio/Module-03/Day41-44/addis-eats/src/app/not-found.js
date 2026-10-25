import Link from "next/link";
import ui from "@/components/ui.module.css";

export default function NotFound() {
  return (
    <main>
      <div className={`${ui.card} ${ui.empty}`}>
        <h1>Page not found</h1>
        <p>That page or dish does not exist (or is no longer on the menu).</p>
        <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>Back to the menu</Link>
      </div>
    </main>
  );
}
