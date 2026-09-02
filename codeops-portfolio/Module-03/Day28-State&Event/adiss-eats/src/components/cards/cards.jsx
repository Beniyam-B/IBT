import PropTypes from "prop-types";

function Cards({ children }) {
return (
    <div className="card">
    {children}
    </div>
);
}

Cards.propTypes = {
children: PropTypes.node.isRequired,
};

export default Cards;