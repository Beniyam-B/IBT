import PropTypes from "prop-types";

function PropType({ name, price, currency, spicy, image, children }) {
return (
    <div>
    <img src={image} alt={name} />
    <div>
        <h3>
            {name}
            {spicy === true && <span> Spicy</span>}
        </h3>
        <p>{price} {currency}</p>
    </div>
    {children}
    </div>
);
}

PropType.defaultProps = {
    currency: "ETB",
    spicy: false,
    image: "",
    children: null,
};

PropType.propTypes = {
    name:     PropTypes.string.isRequired,
    price:    PropTypes.number.isRequired,
    currency: PropTypes.string,
    spicy:    PropTypes.bool,
    image:    PropTypes.string,
    children: PropTypes.node,
};

export default PropType;