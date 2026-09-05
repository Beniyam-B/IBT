import './Header.css'
import { CartContext } from "../../cart/cartProvider.jsx";
import propTypes from "prop-types"
const Header = ({cartCount})=>{
    return(
        <div className="head">
            <div className="header-spacer" aria-hidden="true" />
            <h1> Header </h1>
            <div className="cart">Cart: {cartCount}</div>
        </div>
    )
};
Header.propTypes = {
    cartCount: propTypes.number.isRequired
}
export default Header