import { Suspense } from "react";
import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
  return (
    <div className="menu-layout">
      <aside>
        <Suspense fallback={null}>
          <CategoryBar />
        </Suspense>
      </aside>
      <div className="content">{children}</div>
    </div>
  );
}