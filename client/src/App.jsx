import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Welcome from "./pages/Welcome"; // <-- nuevo

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <Welcome/>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
