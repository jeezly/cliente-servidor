import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Welcome.css";

export default function Welcome() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => { logout(); navigate("/login"); };

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1>Acabas de entrar a un universo cualquiera, Morty.</h1>
        <p>No pasa nada especial.</p>
        <button onClick={salir}>Salir del universo</button>
      </div>
    </div>
  );
}
