import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.ok) {
      if (res.rol === 1) {
        navigate("/welcome");
      } else {
        navigate("/admin");
      }
    } else {
      setErrorMsg("¡Morty, ni siquiera sabes escribir tu contraseña, carajo!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={onSubmit}>
        <h2>Portal Login</h2>
        <input
          name="usuario"
          placeholder="Usuario"
          value={form.usuario}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
  className="btn-portal"
  type="submit"
  disabled={loading}
>
  {loading ? "Cargando..." : "Entrar al portal"}
</button>
        <p>
          ¿Nuevo aquí? <Link to="/register">Registrarme</Link>
        </p>
      </form>

      {/* Fondo portal */}
<div className="portal-bg" aria-hidden="true" />

      {/* Overlay error */}
      {errorMsg && (
        <div className="error-overlay">
          <img src="/assets/rick.png" alt="Rick" />
          <p>{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
