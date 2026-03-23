import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import DashBoard from "./components/DashBoard";
import Register from "./components/Register";
import DashBoard2 from "./components/DashBoard2";
import AttendanceRegistration from "./components/AttendanceRegistration";
import WriteProcedings from "./components/WriteProcedings";
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
import AddTaskForm from "./components/AddTaskForm";
import EditTask from "./components/EditTask";
import AddMeetingForm from "./components/AddMeetingForm";
import EditMeeting from "./components/EditMeeting";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <RegisterProvider>
        <AdminProvider>
          <CoordinatorProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                {/* Rutas de registro */}
                <Route path="/register" element={<Register />} />
                <Route path="/verification-code" element={<VerificationCode />} />
                
                {/* Rutas principales del dashboard */}
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/dashboard2" element={<DashBoard2 />} />
                
                {/* Rutas de administración */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/tasks" element={<TaskManagement />} />
                <Route path="/admin/meetings" element={<MeetingManagement />} />
                <Route path="/admin/agendas" element={<MeetingAgendas />} />
                <Route path="/admin/reports" element={<Reports />} />
                
                {/* Rutas de coordinador */}
                <Route path="/coordinator" element={<CoordinatorDashboard />} />
                
                {/* Rutas de miembro */}
                <Route path="/member" element={<MemberDashboard />} />
                
                {/* Rutas de invitado */}
                <Route path="/guest" element={<GuestDashboard />} />
                
                {/* Rutas de asistencia */}
                <Route path="/attendance" element={<AttendanceRegistration />} />
                <Route path="/proceedings" element={<WriteProcedures />} />
                
                {/* Rutas de edición */}
                <Route path="/edit-user/:id" element={<EditUser />} />
                
                {/* Ruta por defecto */}
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </CoordinatorProvider>
        </AdminProvider>
      </RegisterProvider>
    </AuthProvider>
  );
};

export default App;
