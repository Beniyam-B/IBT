import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "./RequireAuth.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ETHIOPIAN_PHONE_REGEX = /^(?:\+251|251|0)?9\d{8}$/;

function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const { user, register } = useContext(AuthContext);
const navigate = useNavigate();

if (user) return <Navigate to="/menu" replace />;

function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        setError("All fields are required.");
        return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!EMAIL_REGEX.test(cleanEmail)) {
        setError("Please enter a valid email address.");
        return;
    }

    if (!ETHIOPIAN_PHONE_REGEX.test(cleanPhone)) {
        setError("Please enter a valid Ethiopian phone number, e.g. 09xxxxxxxx or +2519xxxxxxxx.");
        return;
    }

    register({ name: name.trim(), email: cleanEmail, phone: cleanPhone, password });
    navigate("/menu", { replace: true });
}

return (
    <div className="auth-form">
    <h2>Create an account</h2>
    {error && <p className="auth-error">{error}</p>}
    <form onSubmit={handleSubmit}>
        <label>
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label>
        Phone
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" />
        </label>
        <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Register</button>
    </form>
    </div>
);
}

export default Register;