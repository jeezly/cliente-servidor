import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "", usuario: "", correo: "", password: ""
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // límites de longitud en cliente
    if (["nombre","usuario","correo"].includes(name) && value.length > 120) return;
    setForm({ ...form, [name]: value });
  };

  const valid = () =>
    form.nombre.trim().length > 0 &&
    form.usuario.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(form.correo) &&
    form.password.length >= 8;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!valid()) {
      setError("Revisa los campos: textos ≤120 y contraseña ≥8.");
      return;
    }
    const res = await register(form);
    if (res.ok) {
      alert("Registro exitoso. Ahora inicia sesión.");
      navigate("/login");
    } else {
      setError(res.message || "Error al registrar.");
    }
  };

  return (
    <div className="reg-container">
      <form className="reg-box" onSubmit={onSubmit}>
        <h2>Crear cuenta</h2>

        <label>
          <span>Nombre</span>
          <input
            name="nombre"
            placeholder="Tu nombre (≤120)"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Usuario</span>
          <input
            name="usuario"
            placeholder="Nombre de usuario (≤120)"
            value={form.usuario}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Correo</span>
          <input
            name="correo"
            type="email"
            placeholder="tú@correo.com (≤120)"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </label>

        <label className="pwd-row">
          <span>Contraseña</span>
          <div className="pwd-wrap">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn-eye"
              onClick={() => setShowPwd(v => !v)}
              title={showPwd ? "Ocultar" : "Mostrar"}
              aria-label="toggle password"
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          </div>
          {/* barra simple de fuerza por longitud */}
          <div className="strength">
            <div
              className="strength-fill"
              style={{
                width:
                  form.password.length >= 12
                    ? "100%"
                    : form.password.length >= 10
                    ? "75%"
                    : form.password.length >= 8
                    ? "50%"
                    : "0%"
              }}
            />
          </div>
        </label>

        {error && <div className="reg-error">{error}</div>}

        <button className="btn-create" type="submit" disabled={loading || !valid()}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <p className="swap">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
