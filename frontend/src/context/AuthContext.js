import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

async function fetchUser(setUser, setLoading) {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  } else {
    setLoading(false);
  }
}

async function login(email, password, setUser, setError) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const token = response.data.token;
    if (!token) {
      throw new Error("No se recibió un token.");
    }
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);
    console.log(decoded.type_user);
    setUser({ email, role: decoded.role, type_user: decoded.type_user });
    setError(null);
    return response.data;
  } catch (error) {
    console.error("Error de inicio de sesión:", error);
    setError("Error de inicio de sesión");
    return null;
  }
}

function logout(setUser) {
  setUser(null);
  localStorage.removeItem("token");
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      fetchUser(setUser, setLoading);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: (email, password) => login(email, password, setUser, setError),
        logout: () => logout(setUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
