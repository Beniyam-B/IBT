import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "./hooks/useFetch.js";
import { useCartStore } from "./cart/cartStore.js";

const localDishImages = import.meta.glob("./components/Main/Menu/Dish/images/*.{jpg,jpeg,png}", { eager: true, import: "default" });

function normalizeForImageMatch(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, "");
}

function pickLocalImage(name) {
  const target = normalizeForImageMatch(name);

  const exact = Object.keys(localDishImages).find((path) => {
    const filename = path.split("/").pop().replace(/\.[^.]+$/, "");
    return normalizeForImageMatch(filename) === target;
  });
  if (exact) return localDishImages[exact];

  const key = Object.keys(localDishImages).find((path) =>
    path.toLowerCase().includes(String(name || "").toLowerCase().split(" ")[0])
  );
  return key ? localDishImages[key] : null;
}

function normalizeDishForDetail(item) {
  const numericId = Number(String(item.id).replace(/\D/g, "")) || String(item.id);
  const name = item.nameEn || item.name || "Dish";

  return {
    ...item,
    id: numericId,
    name,
    price: item.priceETB ?? item.price ?? 0,
    category: item.category || "Main",
    spicy: String(item.spiceLevel || "").toLowerCase().includes("hot") || String(item.spiceLevel || "").toLowerCase().includes("fiery") || Boolean(item.isSpicy),
    image: pickLocalImage(name) || item.image || `https://images.unsplash.com/featured/?${encodeURIComponent(item.slug || item.nameEn || item.name || "ethiopian-food")}&auto=format&fit=crop&w=900&q=80`,
  };
}

function DishDetail() {
  const { id } = useParams();
  const { data: dishes, loading, error } = useFetch("https://addis-eats-backend.onrender.com/menu/");
  const addItem = useCartStore((s) => s.addItem);
  
  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  const normalizedDishes = (dishes ?? []).map(normalizeDishForDetail);
  const dish = normalizedDishes.find((d) => String(d.id) === String(id));
  if (!dish) return <p>No dish called {id}. <Link to="/menu">Back to menu</Link></p>;

  return (
    <div className="dish-detail">
      <img className="dish-detail__image" src={dish.image} alt={dish.name} />
      <h2 className="dish-detail__name">{dish.name} {dish.spicy && <span>🌶</span>}</h2>
      <p className="dish-detail__price">{dish.price} ETB</p>
      <div className="dish-detail__actions">
        <button type="button" className="btn" onClick={() => addItem(dish)}>Add to cart</button>
        <Link className="btn btn--outline" to="/menu">Back to menu</Link>
      </div>
    </div>
  );
}

export default DishDetail;