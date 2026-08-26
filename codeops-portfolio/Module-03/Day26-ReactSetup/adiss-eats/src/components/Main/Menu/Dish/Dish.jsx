import './Dish.css'

const Dish = ({ image, name, price, desc, spicy }) => {
return (
    <article className="dish-item">
    <div className="dish-image">
        <img src={image} alt={name} loading="lazy" />
    </div>
    <div className="dish-info">
        <h3 className="dish-name">
        {name}
        {spicy && <span className="spicy">Spicy</span>}
        </h3>
        <p className="dish-desc">{desc}</p>
        <div className="dish-meta">
        <span className="dish-price">ETB {price}</span>
          <span className="dish-category">{/* optional category */}</span>
        </div>
    </div>
    </article>
)
}

export default Dish
