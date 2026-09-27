import { useState, useContext } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { AuthContext } from "./RequireAuth.jsx";

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
    if (!name.trim() || !password.trim()) { setError("All fields are required."); return; }
    const result = register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
    if (!result.ok) { setError(result.message); return; }
    navigate("/menu", { replace: true });
  }

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Create an account</h2>
      {error && <p className="auth-form__error">{error}</p>}
      <form className="auth-form__body" onSubmit={handleSubmit}>
        <label className="auth-form__field">
          Name
          <input className="auth-form__input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="auth-form__field">
          Email
          <input className="auth-form__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="auth-form__field">
          Phone
          <input className="auth-form__input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09…" />
        </label>
        <label className="auth-form__field">
          Password
          <input className="auth-form__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" className="btn auth-form__submit">Register</button>
      </form>
      <p className="auth-form__switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}

export default Register;