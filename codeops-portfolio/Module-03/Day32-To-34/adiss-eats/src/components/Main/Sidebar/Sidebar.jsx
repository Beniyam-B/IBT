import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Sidebar.css";

const Sidebar = ({ searchText, onSearchChange }) => {
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchRef.current) searchRef.current.focus();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar__content">
        <p className="sidebar__label">Browse menu</p>
        <h2 className="sidebar__title">Find your dish</h2>
        <input
          ref={searchRef}
          type="text"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search dishes..."
          className="sidebar__search"
        />
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
    searchText: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
};

export default Sidebar;