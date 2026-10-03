export default function DishCard({ id, name, description, price }) {
  return (
    <article>
      <h1>{name}</h1>
      <p>{description}</p>
      <p>{price} ETB</p>
    </article>
  );
}