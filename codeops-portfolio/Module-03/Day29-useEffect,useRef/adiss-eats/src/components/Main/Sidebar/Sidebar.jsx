import { useEffect, useRef } from "react";
import "./Sidebar.css";

const Sidebar = () => {
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchRef.current) searchRef.current.focus();
    }, []);

    return (
        <div className="side">
            <div className="side-content">
                <h1>Sidebar</h1>
                <input ref={searchRef} type="text" placeholder="Search Dishes..." />
            </div>
        </div>
    );
};

export default Sidebar;