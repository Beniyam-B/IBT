import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const STORAGE_KEY = "addisEatsUser";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ET_PHONE_RE = /^(?:\+251|0)?9\d{8}$/;

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
    if (!EMAIL_RE.test(email)) return { ok: false, message: "Enter a valid email address." };
    if (!ET_PHONE_RE.test(phone)) return { ok: false, message: "Enter a valid Ethiopian phone number." };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, phone, password }));
    setUser({ name, email, phone });
    return { ok: true };
  }

  function login(email, password) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ok: false, message: "No account found. Please register first." };
    const saved = JSON.parse(stored);
    if (saved.email !== email || saved.password !== password) {
      return { ok: false, message: "Email or password is incorrect." };
    }
    setUser({ name: saved.name, email: saved.email, phone: saved.phone });
    return { ok: true };
  }

  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

RequireAuth.propTypes = { children: PropTypes.node.isRequired };

export default RequireAuth;