import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <aside>
        <CategoryBar />
      </aside>
      <div>{children}</div>
    </div>
  );
}