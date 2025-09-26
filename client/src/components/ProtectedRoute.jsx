import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { rol } = useAuth();
  if (!rol) return <Navigate to="/login" replace />;
  if (adminOnly && rol !== 2) return <Navigate to="/login" replace />;
  return children;
}
