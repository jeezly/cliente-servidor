import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", usuario: "", correo: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.ok) {
      alert("Registro exitoso. Ahora inicia sesión.");
      navigate("/login");
    } else {
      alert(res.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Registrarme</h2>
      <form onSubmit={onSubmit} style={{ display:"grid", gap:10 }}>
        <input name="nombre" placeholder="Nombre (≤120)" value={form.nombre} onChange={handleChange} required />
        <input name="usuario" placeholder="Usuario (≤120)" value={form.usuario} onChange={handleChange} required />
        <input name="correo" placeholder="Correo" type="email" value={form.correo} onChange={handleChange} required />
        <input name="password" placeholder="Contraseña (≥8)" type="password" value={form.password} onChange={handleChange} required />
        <button disabled={loading} type="submit">{loading ? "Creando..." : "Registrarme"}</button>
      </form>
      <p style={{ marginTop:12 }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
