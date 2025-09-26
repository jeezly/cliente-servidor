import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    nombre: "", usuario: "", correo: "", password: "", rol: 1, estatus: "Activo"
  });

  // UI admin
  const [revealMap, setRevealMap] = useState({}); // { [userId]: boolean }
  const [pwdEdit, setPwdEdit] = useState({});     // { [userId]: "nuevaPass" }

  const fetchUsers = async () => {
    const { data } = await api.get("/users"); // backend oculta password (seguro)
    if (data.success) setUsers(data.users);
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createUser = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/users", form);
    if (data.success) {
      setForm({ nombre:"", usuario:"", correo:"", password:"", rol:1, estatus:"Activo" });
      await fetchUsers();
      alert("Usuario creado");
    } else {
      alert(data.message || "Error");
    }
  };

  const updateUser = async (id, changes) => {
    const { data } = await api.put(`/users/${id}`, changes);
    if (data.success) { await fetchUsers(); return true; }
    alert(data.message || "Error"); return false;
  };

  const toggleReveal = (id) => setRevealMap(prev => ({ ...prev, [id]: !prev[id] }));
  const startPwdEdit = (id) => setPwdEdit(prev => ({ ...prev, [id]: "" }));
  const cancelPwdEdit = (id) => {
    setPwdEdit(prev => { const c = { ...prev }; delete c[id]; return c; });
  };
  const confirmPwdEdit = async (id) => {
    const pass = pwdEdit[id] || "";
    if (pass.length < 8) return alert("La contraseña debe tener al menos 8 caracteres.");
    const ok = await updateUser(id, { password: pass });
    if (ok) { alert("Contraseña actualizada"); cancelPwdEdit(id); }
  };

  const roleLabel = (rol) => (rol === 2 ? "Admin" : "Usuario");
  const avatarSrc = (rol) => (rol === 2 ? "/assets/rickprime.png" : "/assets/morty.png");

  // Estilos de botones (colores solicitados)
  const cRickHair = "#42e5f5";    // azul/turquesa pelo Rick
  const cMortyHair = "#7a4b1e";   // café pelo Morty
  const cGreen = "#00ff70";       // verde portal
  const cGreenDark = "#00d45e";

  const btnBase = {
    border: "none",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#000",
    borderRadius: 8
  };

  const btnRick = { ...btnBase, background: cRickHair };
  const btnMorty = { ...btnBase, background: cMortyHair, color: "#fff" };
  const btnDeactivate = { ...btnBase, background: "#ff5e5e" }; // rojo suave
  const btnActivate = { ...btnBase, background: "#ffe066" };   // amarillo
  const btnAction = { ...btnBase, background: cGreen };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", background:"rgba(0,0,0,0.45)", padding:16, borderRadius:12 }}>
      <h2 style={{ color: cGreen, marginTop: 0 }}>Administración de Usuarios</h2>

      {/* Form de alta */}
      <form
        onSubmit={createUser}
        style={{ display:"grid", gap:8, gridTemplateColumns:"repeat(3, 1fr)", marginTop:12 }}
      >
        <input name="nombre" placeholder="Nombre (≤120)" value={form.nombre} onChange={handleChange} required />
        <input name="usuario" placeholder="Usuario (≤120)" value={form.usuario} onChange={handleChange} required />
        <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} required type="email" />
        <input name="password" placeholder="Contraseña (≥8)" value={form.password} onChange={handleChange} type="password" required />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value={1}>Usuario</option>
          <option value={2}>Administrador</option>
        </select>
        <select name="estatus" value={form.estatus} onChange={handleChange}>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
        <button
          type="submit"
          style={{
            gridColumn:"1 / span 3",
            ...btnAction,
            fontSize: 16
          }}
          onMouseDown={(e) => e.currentTarget.style.background = cGreenDark}
          onMouseUp={(e) => e.currentTarget.style.background = cGreen}
        >
          Registrar
        </button>
      </form>

      {/* Tabla */}
      <table style={{ width:"100%", marginTop:16, borderCollapse:"collapse", background:"#0b0b0bdd", color:"#e7ffe7", borderRadius:8, overflow:"hidden" }}>
        <thead style={{ background:"#0e1f0e" }}>
          <tr>
            <th style={{ textAlign:"left", padding:10 }}>Usuario</th>
            <th style={{ textAlign:"left", padding:10 }}>Correo</th>
            <th style={{ textAlign:"left", padding:10 }}>Rol</th>
            <th style={{ textAlign:"left", padding:10 }}>Estatus</th>
            <th style={{ textAlign:"left", padding:10, minWidth:240 }}>Contraseña</th>
            <th style={{ textAlign:"left", padding:10, minWidth:280 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const isRevealed = !!revealMap[u._id];
            const masked = "********";
            const shown = u.password || "(no disponible)"; // backend no devuelve password por seguridad

            return (
              <tr key={u._id} style={{ borderTop:"1px solid #1a2d1a" }}>
                {/* Usuario + avatar */}
                <td style={{ padding:10, display:"flex", alignItems:"center", gap:10 }}>
                  <img
                    src={avatarSrc(u.rol)}
                    alt={u.rol === 2 ? "Rick" : "Morty"}
                    style={{ width:34, height:34, borderRadius:"50%", objectFit:"cover", border:"1px solid #2f2f2f" }}
                  />
                  <div>
                    <div style={{ fontWeight:700 }}>{u.nombre}</div>
                    <div style={{ opacity:0.8, fontSize:12 }}>@{u.usuario}</div>
                  </div>
                </td>

                <td style={{ padding:10 }}>{u.correo}</td>

                {/* Rol */}
                <td style={{ padding:10 }}>
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#000",
                    background: u.rol === 2 ? "#00ffbf" : "#c0ff00",
                    border: "1px solid #222"
                  }}>
                    {u.rol === 2 ? "Admin" : "Usuario"}
                  </span>
                </td>

                {/* Estatus */}
                <td style={{ padding:10 }}>{u.estatus}</td>

                {/* Contraseña */}
                <td style={{ padding:10 }}>
                  <span style={{ fontFamily:"monospace" }}>
                    {isRevealed ? shown : masked}
                  </span>
                  <button
                    onClick={() => toggleReveal(u._id)}
                    title={isRevealed ? "Ocultar" : "Oh wow, mira al gran hacker"}
                    style={{ marginLeft: 8, ...btnBase, background:"#1f1f1f", color:"#e7ffe7", border:"1px solid #2e2e2e" }}
                    type="button"
                  >
                    {isRevealed ? "🙈" : "👁️"}
                  </button>

                  {/* Editor inline de contraseña */}
                  {pwdEdit[u._id] === undefined ? (
                    <button
                      onClick={() => startPwdEdit(u._id)}
                      style={{ marginLeft: 8, ...btnBase, background:"#1f1f1f", color:"#e7ffe7", border:"1px solid #2e2e2e" }}
                      type="button"
                      title="Cambiar contraseña"
                    >
                      Cambiar Pass
                    </button>
                  ) : (
                    <span style={{ marginLeft: 8, display:"inline-flex", gap:6, alignItems:"center" }}>
                      <input
                        type="password"
                        placeholder="Nueva contraseña (≥8)"
                        value={pwdEdit[u._id]}
                        onChange={(e) => setPwdEdit(prev => ({ ...prev, [u._id]: e.target.value }))}
                        style={{ width: 180 }}
                      />
                      <button type="button" style={{ ...btnAction }} onClick={() => confirmPwdEdit(u._id)}>Guardar</button>
                      <button type="button" style={{ ...btnBase, background:"#333", color:"#e7ffe7" }} onClick={() => cancelPwdEdit(u._id)}>Cancelar</button>
                    </span>
                  )}
                </td>

                {/* Acciones (2x2) */}
                <td style={{ padding:10 }}>
                  <div
                    style={{
                      display:"grid",
                      gridTemplateColumns:"1fr 1fr",
                      gap:8,
                      maxWidth: 320
                    }}
                  >
                    {/* Convertir a Rick (rol=2) */}
                    <button
                      style={btnRick}
                      onClick={() => updateUser(u._id, { rol: 2 })}
                      title="Cambiar a Admin"
                    >
                      Ok, ahora eres un Rick. No la cagues.
                    </button>

                    {/* Convertir a Morty (rol=1) */}
                    <button
                      style={btnMorty}
                      onClick={() => updateUser(u._id, { rol: 1 })}
                      title="Cambiar a Usuario"
                    >
                      Wákala, Morty.
                    </button>

                    {/* Desactivar */}
                    <button
                      style={btnDeactivate}
                      onClick={() => updateUser(u._id, { estatus: "Inactivo" })}
                      title="Desactivar usuario"
                    >
                      Sí, este Morty ya no sirve. Adiós.
                    </button>

                    {/* Activar */}
                    <button
                      style={btnActivate}
                      onClick={() => updateUser(u._id, { estatus: "Activo" })}
                      title="Activar usuario"
                    >
                      Recluta a este Morty.
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan="6" style={{ padding:16, opacity:.8 }}>Sin usuarios</td>
            </tr>
          )}
        </tbody>
      </table>

      <p style={{ marginTop:12, fontSize:12, opacity:.7, color:"#c8ffc8" }}>
        Nota: no es posible recuperar la contraseña original de ningún usuario.
        Usa <b>Cambiar Pass</b> para establecer una nueva.
      </p>
    </div>
  );
}
