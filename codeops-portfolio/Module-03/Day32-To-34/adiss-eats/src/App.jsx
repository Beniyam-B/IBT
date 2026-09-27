import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Layout from "./Layout.jsx";
import Main from "./components/Main/Main.jsx";
import DishDetail from "./DishDetail.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import { AuthProvider } from "./auth/RequireAuth.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { useCartStore } from "./cart/cartStore.js";
import { useFetch } from "./hooks/useFetch.js";

const Checkout = lazy(() => import("./Checkout.jsx"));

const localDishImages = import.meta.glob("./components/Main/Menu/Dish/images/*.{jpg,jpeg,png}", { eager: true, import: "default" });

function normalizeForImageMatch(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, "");
}

function pickLocalImage(name) {
  const target = normalizeForImageMatch(name);

  // try exact normalized filename match first
  const exact = Object.keys(localDishImages).find((path) => {
    const filename = path.split("/").pop().replace(/\.[^.]+$/, "");
    return normalizeForImageMatch(filename) === target;
  });
  if (exact) return localDishImages[exact];

  // fallback to previous first-word match
  const key = Object.keys(localDishImages).find((path) =>
    path.toLowerCase().includes(String(name || "").toLowerCase().split(" ")[0])
  );
  return key ? localDishImages[key] : null;
}

function buildDishImage(dish) {
  const slug = dish?.slug || dish?.nameEn || dish?.name || "ethiopian-food";
  return `https://images.unsplash.com/featured/?${encodeURIComponent(slug)}&auto=format&fit=crop&w=900&q=80`;
}

function normalizeDish(dish) {
  const numericId = Number(String(dish.id).replace(/\D/g, "")) || String(dish.id);
  const name = dish.nameEn || dish.name || "Dish";

  return {
    ...dish,
    id: numericId,
    name,
    price: dish.priceETB ?? dish.price ?? 0,
    category: dish.category || "Main",
    spicy: String(dish.spiceLevel || "").toLowerCase().includes("hot") || String(dish.spiceLevel || "").toLowerCase().includes("fiery") || Boolean(dish.isSpicy),
    image: pickLocalImage(name) || dish.image || buildDishImage(dish),
  };
}

function Home() {
  const { data: dishes, loading, error } = useFetch("https://addis-eats-backend.onrender.com/menu/specials");
  const addItem = useCartStore((s) => s.addItem);
  const featured = Array.isArray(dishes) && dishes[0] ? normalizeDish(dishes[0]) : null;

  return (
    <div className="home">
      <h1 className="home__title">Addis Eats</h1>
      <p className="home__subtitle">Today's specials, delivered fast.</p>

      {loading ? (
        <p>Loading today's special…</p>
      ) : error ? (
        <p>{error}</p>
      ) : featured ? (
        <div className="featured-dish">
          <p className="featured-dish__label">Today's Special</p>
          <img className="featured-dish__image" src={featured.image} alt={featured.name} />
          <h3 className="featured-dish__name">{featured.name}</h3>
          <p className="featured-dish__price">{featured.price} ETB</p>
          <div className="featured-dish__actions">
            <button type="button" className="btn" onClick={() => addItem(featured)}>Add to cart</button>
            <Link className="btn btn--outline" to={`/menu/${featured.id}`}>View</Link>
          </div>
        </div>
      ) : null}

      <Link className="btn home__cta" to="/menu">See the menu</Link>
    </div>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <h2 className="not-found__title">Page not found</h2>
      <Link className="not-found__link" to="/">Go back home</Link>
    </div>
  );
}

function Cart() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="cart-page__title">Your cart is empty</h2>
        <Link className="btn" to="/menu">Browse the menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-page__title">Your order</h2>
      <ul className="cart-page__items">
        {items.map((item) => (
          <li className="cart-page__item" key={item.id}>
            <span>{item.name} × {item.quantity}</span>
            <span>{item.price * item.quantity} ETB</span>
            <button type="button" className="cart-page__remove" onClick={() => removeItem(item.id)}>Remove one</button>
          </li>
        ))}
      </ul>
      <p className="cart-page__total">Total: {total} ETB</p>
      <div className="cart-page__actions">
        <button type="button" className="btn btn--outline" onClick={clearCart}>Clear cart</button>
        <Link className="btn" to="/checkout">Go to checkout</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="menu"
              element={
                <ErrorBoundary fallback={<p className="menu-section__empty">The menu is unavailable right now. <Link to="/">Go home</Link></p>}>
                  <Main />
                </ErrorBoundary>
              }
            />
            <Route path="menu/:id" element={<DishDetail />} />
            <Route
              path="cart"
              element={
                <ErrorBoundary fallback={<p className="cart-page">Your cart is unavailable right now. <Link to="/menu">Back to menu</Link></p>}>
                  <Cart />
                </ErrorBoundary>
              }
            />
            <Route
              path="checkout"
              element={
                <RequireAuth>
                  <Suspense fallback={<p className="checkout">Loading checkout…</p>}>
                    <Checkout />
                  </Suspense>
                </RequireAuth>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;