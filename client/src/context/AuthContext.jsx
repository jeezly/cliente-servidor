import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [rol, setRol] = useState(Number(localStorage.getItem("rol")) || null);
  const [loading, setLoading] = useState(false);

  const login = async ({ usuario, password }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { usuario, password });
      if (data?.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        setRol(data.rol);
        return { ok: true, rol: data.rol, message: data.message };
      }
      return { ok: false, message: data?.message || "Error al iniciar sesión" };
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || "Error" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      return { ok: data?.success, message: data?.message || "Registrado" };
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || "Error" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ rol, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
