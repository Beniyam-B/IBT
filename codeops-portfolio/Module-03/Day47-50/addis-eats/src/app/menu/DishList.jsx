import DishItem from "./DishItem";
import styles from "./menu.module.css";

// Server component: the first page of the menu as plain HTML, no JavaScript of its own.
export default function DishList({ dishes }) {
  return (
    <ul className={styles.dishList}>
      {dishes.map((dish) => (
        <DishItem key={dish.id} dish={dish} />
      ))}
    </ul>
  );
}
