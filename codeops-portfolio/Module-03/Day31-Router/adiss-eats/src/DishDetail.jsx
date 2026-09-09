import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "./hooks/useFetch.js";
import { CartContext } from "./cart/cartProvider.jsx";

function DishDetail() {
const { id } = useParams();
const { data: dishes, loading, error } = useFetch("/dishes.json");
const { addItem } = useContext(CartContext);

if (loading) return <p>Loading…</p>;
if (error) return <p>{error}</p>;

const dish = dishes?.find((d) => String(d.id) === id);
if (!dish) return <p>No dish called {id}. <Link to="/menu">Back to menu</Link></p>;

return (
    <div className="dish-detail">
    <img src={dish.image} alt={dish.name} />
    <h2>{dish.name} {dish.spicy && <span>🌶 Spicy</span>}</h2>
    <p>{dish.price} ETB</p>
    <button type="button" onClick={() => addItem(dish)}>Add to cart</button>
    <Link to="/menu">Back to menu</Link>
    </div>
);
}

export default DishDetail;