import { useState, useContext } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "./RequireAuth.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ETHIOPIAN_PHONE_REGEX = /^(?:\+251|251|0)?9\d{8}$/;

function Login() {
const [mode, setMode] = useState("login"); // "login" | "register"
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const { user, login, register } = useContext(AuthContext);
const navigate = useNavigate();
const location = useLocation();
const from = location.state?.from?.pathname ?? "/menu";

if (user) return <Navigate to={from} replace />;

function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "register") {
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
        return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
        setError("Email and password are required.");
        return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
        setError("Please enter a valid email address.");
        return;
    }

    const result = login(cleanEmail, password);
    if (!result.ok) {
        setError(result.message);
        return;
    }
    navigate(from, { replace: true });
}

return (
    <div className="auth-form">
    <h2>{mode === "login" ? "Sign in" : "Create an account"}</h2>
    {error && <p className="auth-error">{error}</p>}
    <form onSubmit={handleSubmit}>
        {mode === "register" && (
        <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        )}
        <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        {mode === "register" && (
        <label>
        Phone
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" />
        </label>
        )}
        <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">{mode === "login" ? "Sign in" : "Register"}</button>
    </form>
    <p>
        {mode === "login" ? (
        <>No account yet? <button type="button" onClick={() => setMode("register")}>Register</button></>
        ) : (
        <>Already have an account? <button type="button" onClick={() => setMode("login")}>Sign in</button></>
        )}
    </p>
    </div>
);
}

export default Login;