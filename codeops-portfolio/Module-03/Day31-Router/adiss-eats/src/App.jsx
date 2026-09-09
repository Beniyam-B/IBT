import { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Layout from "./Layout.jsx";
import Main from "./components/Main/Main.jsx";
import DishDetail from "./DishDetail.jsx";
import Checkout from "./Checkout.jsx";
import Login from "./auth/Login.jsx";
import { CartProvider, CartContext } from "./cart/cartProvider.jsx";
import { AuthProvider } from "./auth/RequireAuth.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import { useFetch } from "./hooks/useFetch.js";

function Home() {
  const { data: dishes, loading, error } = useFetch("/dishes.json");
  const { addItem } = useContext(CartContext);

  const featured = dishes?.[0];

  return (
    <div className="home">
      <h1>Addis Eats</h1>
      <p>Today's specials, delivered fast.</p>

      {loading ? (
        <p>Loading today's special…</p>
      ) : error ? (
        <p>{error}</p>
      ) : featured ? (
        <div className="featured-dish">
          <h2>Today's Special</h2>
          <img src={featured.image} alt={featured.name} />
          <h3>{featured.name}</h3>
          <p>{featured.price} ETB</p>
          <div className="home-actions">
            <button type="button" className="primary-btn" onClick={() => addItem(featured)}>Add to cart</button>
            <Link to={`/menu/${featured.id}`} className="secondary-link">View details</Link>
          </div>
        </div>
      ) : null}

      <Link to="/menu"><button type="button" className="primary-btn">See the menu</button></Link>
    </div>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <h2>Page not found</h2>
      <Link to="/">Go back home</Link>
    </div>
  );
}

function Cart() {
  const { items, total, removeItem, clearCart } = useContext(CartContext);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your cart is empty</h2>
        <Link to="/menu" className="primary-link">Browse the menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your order</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — {item.price * item.quantity} ETB
            <button type="button" className="secondary-btn" onClick={() => removeItem(item.id)}>Remove one</button>
          </li>
        ))}
      </ul>
      <p>Total: {total} ETB</p>
      <button type="button" className="secondary-btn" onClick={clearCart}>Clear cart</button>
      <Link to="/checkout"><button type="button" className="primary-btn">Go to checkout</button></Link>
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;