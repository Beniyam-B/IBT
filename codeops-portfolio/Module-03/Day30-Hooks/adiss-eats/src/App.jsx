import "./App.css";
import Header from "./components/Header/Header.jsx";
import Main from "./components/Main/Main.jsx";
import Footer from "./components/Footer/Footer.jsx";
// import OrderForm from "./components/Proptype/States.jsx";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Main />
      {/* <OrderForm /> */}
      <Footer />
    </div>
  );
}

export default App;