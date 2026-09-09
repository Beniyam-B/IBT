import PropTypes from "prop-types";
import "./Cards.css";

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