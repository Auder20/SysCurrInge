import React, { createContext, useState } from "react";
import api from "../services/api";

const CoordinatorContext = createContext();

export const CoordinatorProvider = ({ children }) => {
  // User functions
  async function loadAllUsers() {
    try {
      const response = await api.get("/coordinator/loadUsers");
      return response.data;
    } catch (error) {
      console.error("Error al cargar todos los usuarios:", error);
      return [];
    }
  }

  // Task functions
  async function loadAllTasks() {
    try {
      const response = await api.get("/coordinator/loadTasks");
      return response.data;
    } catch (error) {
      console.error("Error al cargar todas las tareas:", error);
      return [];
    }
  }

  async function addTask(taskData) {
    try {
      const response = await api.post("/coordinator/addTask", taskData);
      console.log("Tarea agregada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
      throw error;
    }
  }

  async function deleteTask(taskId) {
    try {
      const response = await api.delete(`/coordinator/deleteTask/${taskId}`);
      console.log("Tarea eliminada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      throw error;
    }
  }

  async function getTaskById(taskId) {
    try {
      const response = await api.get(`/coordinator/loadTaskById?id=${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la tarea:", error);
      return null;
    }
  }

  async function updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/coordinator/updateTask?id=${taskId}`, taskData);
      console.log("Tarea actualizada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      throw error;
    }
  }

  // Meeting functions
  async function loadAllMeetings() {
    try {
      const response = await api.get("/coordinator/loadMeetings");
      return response.data;
    } catch (error) {
      console.error("Error al cargar todas las reuniones:", error);
      return [];
    }
  }

  async function addMeeting(meetingData) {
    try {
      const response = await api.post("/coordinator/addMeeting", meetingData);
      console.log("Reunión agregada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al agregar la reunión:", error);
      throw error;
    }
  }

  async function deleteMeeting(meetingId) {
    try {
      const response = await api.delete(`/coordinator/deleteMeeting/${meetingId}`);
      console.log("Reunión eliminada con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la reunión:", error);
      throw error;
    }
  }

  return (
    <CoordinatorContext.Provider
      value={{
        loadAllUsers,
        loadAllTasks,
        addTask,
        deleteTask,
        getTaskById,
        updateTask,
        loadAllMeetings,
        addMeeting,
        deleteMeeting,
      }}
    >
      {children}
    </CoordinatorContext.Provider>
  );
};

export default CoordinatorContext;
