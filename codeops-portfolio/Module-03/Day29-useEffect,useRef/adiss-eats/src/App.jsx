import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Main from "./components/Main/Main.jsx";
import Footer from "./components/Footer/Footer.jsx";
// import OrderForm from "./components/Proptype/States.jsx";

function App() {
  const [cartCount, setCartCount] = useState(0);

  function handleAddToCart() {
    setCartCount((prev) => prev + 1);
  }

  function handleRemoveFromCart() {
    setCartCount((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="app-shell">
      <Header cartCount={cartCount} />
      <Main onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} />
      {/* <OrderForm /> */}
      <Footer />
    </div>
  );
}

export default App;