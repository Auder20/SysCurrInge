import React, { createContext, useState } from "react";
import api from "../services/api";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  async function loadAllUsers() {
    try {
      const response = await api.get("/admin/loadUsers");
      return response.data;
    } catch (error) {
      console.error("Error al cargar todos los usuarios:", error);
      return [];
    }
  }

  async function loadAllTasks() {
    try {
      const response = await api.get("/admin/loadTasks");
      return response.data;
    } catch (error) {
      console.error("Error al cargar todas las tareas:", error);
      return [];
    }
  }

  async function getUserById(id) {
    try {
      const response = await api.get("/admin/loadUserById", { params: { id } });
      console.log("se obtuvo ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cargar el usuario a editar...:", error);
      return [];
    }
  }

  async function getTaskById(id) {
    try {
      const response = await api.get("/admin/loadTaskById", { params: { id } });
      console.log("se obtuvo ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cargar la tarea a editar...:", error);
      return [];
    }
  }

  async function updateUser(id, userData) {
    try {
      const response = await api.put("/admin/updateUser", userData, {
        params: { id },
      });
      console.log("Usuario actualizado con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }
  async function updateTask(id, userData) {
    try {
      const response = await api.put("/admin/updateTask", userData, {
        params: { id },
      });
      console.log("Tarea actualizada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      throw error;
    }
  }

  async function deleteUser(id) {
    try {
      const response = await api.delete(`/admin/deleteUser/${id}`);
      console.log("Usuario eliminado con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  }

  async function deleteTask(id) {
    try {
      const response = await api.delete(`/admin/deleteTask/${id}`);
      console.log("Tarea eliminada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      throw error;
    }
  }

  async function addTask(tarea) {
    try {
      // Enviamos el objeto 'tarea' directamente al backend
      const response = await api.post("/admin/addTask", tarea);
      console.log("Tarea agregada", response.data);

      return response.data;
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
      throw error;
    }
  }

  async function addMeeting(reunion) {
    try {
      // Enviamos el objeto 'reunion' directamente al backend
      const response = await api.post("/admin/addMeeting", reunion);
      console.log("Reunion agregada", response.data);

      return response.data;
    } catch (error) {
      console.error("Error al agregar la reunion:", error);
      throw error;
    }
  }

  async function loadAllMeetings() {
    try {
      const response = await api.get("/admin/loadMeetings");
      return response.data;
    } catch (error) {
      console.error("Error al cargar todas las reuniones:", error);
      return [];
    }
  }

  async function deleteMeeting(id) {
    try {
      const response = await api.delete(`/admin/deleteMeeting/${id}`);
      console.log("Reunión eliminada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la reunión:", error);
      throw error;
    }
  }

  async function getMeetingById(id) {
    try {
      const response = await api.get(`/admin/loadMeetingById?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la reunión:", error);
      return null;
    }
  }

  async function updateMeeting(id, meetingData) {
    try {
      const response = await api.put(`/admin/updateMeeting?id=${id}`, meetingData);
      console.log("Reunión actualizada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la reunión:", error);
      throw error;
    }
  }

  async function saveAgenda(id_reunion, agendaItems) {
    try {
      const response = await api.post(`/admin/saveAgenda/${id_reunion}`, {
        agendaItems
      });
      console.log("Agenda guardada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al guardar la agenda:", error);
      throw error;
    }
  }

  async function getAgendaByMeeting(id_reunion) {
    try {
      const response = await api.get(`/admin/agenda/${id_reunion}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la agenda:", error);
      return [];
    }
  }

  return (
    <AdminContext.Provider
      value={{
        loadAllUsers,
        getUserById,
        updateUser,
        deleteUser,
        addTask,
        loadAllTasks,
        deleteTask,
        getTaskById,
        updateTask,
        addMeeting,
        loadAllMeetings,
        deleteMeeting,
        saveAgenda,
        getAgendaByMeeting,
        getMeetingById,
        updateMeeting,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
