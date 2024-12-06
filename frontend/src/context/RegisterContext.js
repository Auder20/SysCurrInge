import React, { createContext, useState } from "react";
import api from "../services/api";

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const register = async (name, lastname, email, password, role, userType) => {
    try {
      console.log("aqui entra en el context");
      const response = await api.post("/register/register", {
        name,
        lastname,
        email,
        password,
        role,
        userType,
      });
      console.log("Registro exitoso:", response.data);
      console.log(userType, "si no hay nada antes esta vacio");
      setStatus({
        loading: false,
        message: response.data.message,
        error: "",
      });
      return response.data;
    } catch (error) {
      console.error("Error en el registro:", error);
      setStatus({
        loading: false,
        message: "",
        error: "Hubo un error en el registro. Inténtalo de nuevo.",
      });
      throw error;
    }
  };

  const validateAdminRole = async () => {
    try {
      const response = await api.get("/register/admin-exists");
      return response.data === true; // Retorna `true` si no existe un administrador
    } catch (error) {
      console.error("Error al verificar si existe un administrador:", error);
      setStatus({
        loading: false,
        message: "",
        error: "Error al verificar administrador.",
      });
      return false;
    }
  };

  const generateCode = async (email) => {
    try {
      setStatus({ loading: true, message: "", error: "" });
      const response = await api.post("/register/send-verification-code", {
        email,
      });
      setStatus({
        loading: false,
        message: "Código de verificación enviado al correo.",
        error: "",
      });
      return true;
    } catch (error) {
      console.error("Error al enviar el código de verificación:", error);
      setStatus({
        loading: false,
        message: "",
        error: "No se pudo enviar el código de verificación. Intenta de nuevo.",
      });
      return false;
    }
  };

  const verifyCode = async (email, code) => {
    try {
      setStatus({ loading: true, message: "", error: "" });
      const response = await api.post("/register/verify-code", { email, code });

      // Si la respuesta del backend es exitosa
      if (response.status === 200) {
        setStatus({
          loading: false,
          message: response.data.message, // El mensaje de éxito del backend
          error: "",
        });
        console.log("verificado correctamente el codigo");
        return true;
      }

      // Si hay algún error
      if (response.status === 400) {
        setStatus({
          loading: false,
          message: "",
          error: response.data.error, // El mensaje de error del backend
        });
        console.log("verificacion incorrecta, codigo incorrecto");
        return false;
      }
    } catch (error) {
      console.error("Error al verificar el código:", error);
      setStatus({
        loading: false,
        message: "",
        error: "Hubo un error al verificar el código.",
      });
      return false;
    }
  };

  return (
    <RegisterContext.Provider
      value={{ register, validateAdminRole, generateCode, verifyCode, status }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterContext;
