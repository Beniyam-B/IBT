import { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Layout from "./Layout.jsx";
import Main from "./components/Main/Main.jsx";
import DishDetail from "./DishDetail.jsx";
import Checkout from "./Checkout.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import { CartProvider, CartContext } from "./cart/cartProvider.jsx";
import { AuthProvider } from "./auth/RequireAuth.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import { useFetch } from "./hooks/useFetch.js";

function buildDishImage(dish) {
  const slug = dish?.slug || dish?.nameEn || dish?.name || "ethiopian-food";
  return `https://images.unsplash.com/featured/?${encodeURIComponent(slug)}&auto=format&fit=crop&w=900&q=80`;
}

function normalizeDish(dish) {
  const numericId = Number(String(dish.id).replace(/\D/g, "")) || String(dish.id);

  return {
    ...dish,
    id: numericId,
    name: dish.nameEn || dish.name || "Dish",
    price: dish.priceETB ?? dish.price ?? 0,
    category: dish.category || "Main",
    spicy: String(dish.spiceLevel || "").toLowerCase().includes("hot") || String(dish.spiceLevel || "").toLowerCase().includes("fiery") || Boolean(dish.isSpicy),
    image: dish.image || buildDishImage(dish),
  };
}

function Home() {
  const { data: dishes, loading, error } = useFetch("https://addis-eats-backend.onrender.com/menu/specials");
  const { addItem } = useContext(CartContext);
  const featured = Array.isArray(dishes) ? normalizeDish(dishes[0]) : null;

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
  const { items, total, removeItem, clearCart } = useContext(CartContext);

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
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Main />} />
              <Route path="menu/:id" element={<DishDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;