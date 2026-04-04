import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import DashBoard from "./components/DashBoard";
import Register from "./components/Register";
import AttendanceRegistration from "./components/AttendanceRegistration";
import MeetingAgendas from "./components/MeetingAgendas";
import MeetingManagement from "./components/MeetingManagement";
import { RegisterProvider } from "./context/RegisterContext";
import { AdminProvider } from "./context/AdminContext";
import { CoordinatorProvider } from "./context/CoordinatorContext";
import AdminDashboard from "./components/AdminDashBoard";
import UserManagement from "./components/UserManagement";
import TaskManagement from "./components/TaskManagement";
import MeetingScheduler from "./components/MeetingScheduler";
import Reports from "./components/Reports";
import CoordinatorDashboard from "./components/CordinatorDashBoard";
import MemberDashboard from "./components/MemberDashBoard";
import GuestDashboard from "./components/GuestDashBoard";
import VerificationCode from "./components/VerificationCode";
import EditUser from "./components/EditUser";
import EditUserSimple from "./components/EditUserSimple";
import AddTaskForm from "./components/AddTaskForm";
import EditTask from "./components/EditTask";
import AddMeetingForm from "./components/AddMeetingForm";
import EditMeeting from "./components/EditMeeting";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

const AppContent = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Rutas de registro */}
        <Route path="/register" element={<Register />} />
        <Route path="/verification-code" element={<VerificationCode />} />
        
        {/* Rutas principales del dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        
        {/* Rutas de administración */}
        <Route path="/admin" element={<ProtectedRoute roles={['administrador']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['administrador']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/tasks" element={<ProtectedRoute roles={['administrador']}><TaskManagement /></ProtectedRoute>} />
        <Route path="/admin/meetings" element={<ProtectedRoute roles={['administrador']}><MeetingManagement /></ProtectedRoute>} />
        <Route path="/admin/agendas" element={<ProtectedRoute roles={['administrador']}><MeetingAgendas /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={['administrador']}><Reports /></ProtectedRoute>} />
        
        {/* Rutas para agregar */}
        <Route path="/addTaskForm" element={<ProtectedRoute roles={['administrador']}><AddTaskForm /></ProtectedRoute>} />
        <Route path="/addMeetingForm" element={<ProtectedRoute roles={['administrador']}><AddMeetingForm /></ProtectedRoute>} />
        
        {/* Rutas para editar */}
        <Route path="/editTask/:id" element={<ProtectedRoute roles={['administrador']}><EditTask /></ProtectedRoute>} />
        <Route path="/editMeeting/:id" element={<ProtectedRoute roles={['administrador']}><EditMeeting /></ProtectedRoute>} />
        <Route path="/edit-user/:id" element={<ProtectedRoute roles={['administrador']}><EditUser /></ProtectedRoute>} />
        
        {/* Rutas de coordinador */}
        <Route path="/coordinator" element={<ProtectedRoute roles={['coordinador']}><CoordinatorDashboard /></ProtectedRoute>} />
        
        {/* Rutas de miembro */}
        <Route path="/member" element={<ProtectedRoute roles={['participante']}><MemberDashboard /></ProtectedRoute>} />
        
        {/* Rutas de invitado */}
        <Route path="/guest" element={<ProtectedRoute><GuestDashboard /></ProtectedRoute>} />
        
        {/* Rutas de asistencia */}
        <Route path="/attendance" element={<ProtectedRoute><AttendanceRegistration /></ProtectedRoute>} />
        
        
        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <RegisterProvider>
        <AdminProvider>
          <CoordinatorProvider>
            <AppContent />
          </CoordinatorProvider>
        </AdminProvider>
      </RegisterProvider>
    </AuthProvider>
  );
};

export default App;
