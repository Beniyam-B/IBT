import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const STORAGE_KEY = "addisEatsUser";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
    const saved = JSON.parse(stored);
    setUser({ name: saved.name, email: saved.email, phone: saved.phone });
    }
    setLoading(false);
}, []);

function register({ name, email, phone, password }) {
    const account = { name, email: email.toLowerCase(), phone, password };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    setUser({ name, email: account.email, phone });
}

function login(email, password) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ok: false, message: "No account found. Please register first." };
    const saved = JSON.parse(stored);
    const savedEmail = (saved.email ?? saved.phone ?? "").toLowerCase();
    if (savedEmail !== email.toLowerCase() || saved.password !== password) {
    return { ok: false, message: "Email or password is incorrect." };
    }
    setUser({ name: saved.name, email: saved.email, phone: saved.phone });
    return { ok: true };
}

function logout() {
    setUser(null);
}

return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
    {children}
    </AuthContext.Provider>
);
}

AuthProvider.propTypes = {
children: PropTypes.node.isRequired,
};

function RequireAuth({ children }) {
const { user, loading } = useContext(AuthContext);
const location = useLocation();

if (loading) return <p>Loading…</p>;
if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
return children;
}

RequireAuth.propTypes = {
children: PropTypes.node.isRequired,
};

export default RequireAuth;