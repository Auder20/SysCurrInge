import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Componente Navbar
const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    <ul className="flex space-x-4">
      <li>
        <a href="#" className="hover:text-gray-300">
          Inicio
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-gray-300">
          Reuniones
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-gray-300">
          Actas
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-gray-300">
          Tareas
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-gray-300">
          Repositorio
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-gray-300">
          Reportes
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-gray-300">
          Usuarios
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-gray-300">
          Perfil
        </a>
      </li>
    </ul>
  </nav>
);

// Componente ProximasReuniones
const ProximasReuniones = ({ reuniones }) => (
  <Card>
    <CardHeader>Próximas Reuniones</CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {reuniones.map((reunion, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>
              {reunion.fecha} - {reunion.tema}
            </span>
            <Button variant="outline" size="sm">
              Ver Detalles
            </Button>
          </li>
        ))}
      </ul>
      <Button className="mt-4">Crear Nueva Reunión</Button>
    </CardContent>
  </Card>
);

// Componente TareasPendientes
const TareasPendientes = ({ tareas }) => (
  <Card>
    <CardHeader>Tareas Pendientes</CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {tareas.map((tarea, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>
              {tarea.descripcion} - Vence: {tarea.fechaLimite}
            </span>
            <Button variant="outline" size="sm">
              Ver Detalles
            </Button>
          </li>
        ))}
      </ul>
      <Button className="mt-4">Crear Nueva Tarea</Button>
    </CardContent>
  </Card>
);

// Componente ActasRecientes
const ActasRecientes = ({ actas }) => (
  <Card>
    <CardHeader>Actas Recientes</CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {actas.map((acta, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>
              {acta.titulo} - {acta.fecha}
            </span>
            <Button variant="outline" size="sm">
              Ver Acta
            </Button>
          </li>
        ))}
      </ul>
      <Button className="mt-4">Crear Nueva Acta</Button>
    </CardContent>
  </Card>
);

// Componente EstadisticasGenerales
const EstadisticasGenerales = ({ datos }) => (
  <Card>
    <CardHeader>Estadísticas Generales</CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completadas" fill="#8884d8" />
          <Bar dataKey="pendientes" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      <Button className="mt-4">Generar Reporte Detallado</Button>
    </CardContent>
  </Card>
);

// Componente BuscadorRapido
const BuscadorRapido = () => {
  const [busqueda, setBusqueda] = useState("");

  return (
    <Card>
      <CardHeader>Buscador Rápido</CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Buscar actas, reuniones o tareas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Button className="mt-2">Buscar</Button>
      </CardContent>
    </Card>
  );
};

// Componente NotificacionesRecientes
const NotificacionesRecientes = ({ notificaciones }) => (
  <Card>
    <CardHeader>Notificaciones Recientes</CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {notificaciones.map((notificacion, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{notificacion.mensaje}</span>
            <Button variant="outline" size="sm">
              Ver
            </Button>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// Componente principal Dashboard
const Dashboard = () => {
  // Datos de ejemplo
  const reuniones = [
    { fecha: "2024-09-22", tema: "Reunión de planificación" },
    { fecha: "2024-09-25", tema: "Revisión de proyectos" },
  ];

  const tareas = [
    { descripcion: "Preparar informe", fechaLimite: "2024-09-30" },
    { descripcion: "Revisar propuesta", fechaLimite: "2024-10-05" },
  ];

  const actas = [
    { titulo: "Acta reunión 15/09", fecha: "2024-09-15" },
    { titulo: "Acta reunión 08/09", fecha: "2024-09-08" },
  ];

  const datosEstadisticas = [
    { name: "Tareas", completadas: 20, pendientes: 10 },
    { name: "Reuniones", completadas: 15, pendientes: 5 },
  ];

  const notificaciones = [
    { mensaje: "Reunión en 1 hora" },
    { mensaje: "Tarea vence mañana" },
  ];

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <ProximasReuniones reuniones={reuniones} />
        <TareasPendientes tareas={tareas} />
        <ActasRecientes actas={actas} />
        <EstadisticasGenerales datos={datosEstadisticas} />
        <BuscadorRapido />
        <NotificacionesRecientes notificaciones={notificaciones} />
      </div>
    </div>
  );
};

export default Dashboard;
