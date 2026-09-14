import { useState, useContext } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { AuthContext } from "./RequireAuth.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/menu";

  if (user) return <Navigate to={from} replace />;

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email.trim(), password);
    if (!result.ok) { setError(result.message); return; }
    navigate(from, { replace: true });
  }

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Sign in</h2>
      {error && <p className="auth-form__error">{error}</p>}
      <form className="auth-form__body" onSubmit={handleSubmit}>
        <label className="auth-form__field">
          Email
          <input className="auth-form__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="auth-form__field">
          Password
          <input className="auth-form__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" className="btn auth-form__submit">Sign in</button>
      </form>
      <p className="auth-form__switch">No account yet? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;