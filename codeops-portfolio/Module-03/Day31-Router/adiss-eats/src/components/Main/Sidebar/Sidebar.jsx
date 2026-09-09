import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Sidebar.css";

const Sidebar = ({ searchText, onSearchChange }) => {
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchRef.current) searchRef.current.focus();
    }, []);

    return (
        <div className="side">
            <div className="side-content">
                <h1>Sidebar</h1>
                <input
                    ref={searchRef}
                    type="text"
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search Dishes..."
                />
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    searchText: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
};

export default Sidebar;