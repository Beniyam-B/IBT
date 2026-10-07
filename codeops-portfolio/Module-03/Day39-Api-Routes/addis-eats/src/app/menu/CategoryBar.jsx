export default function CategoryBar() {
  const categories = ["All", "Vegetarian", "Meat", "Drinks"];
  return (
    <nav>
      <ul>
        {categories.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </nav>
  );
}