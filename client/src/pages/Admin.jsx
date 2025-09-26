import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserTable from "../components/UserTable";
import "./Admin.css";

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const salir = () => { logout(); navigate("/login"); };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
        <button className="btn-exit" onClick={salir}>Salir</button>
      </header>
      <UserTable />
    </div>
  );
}
