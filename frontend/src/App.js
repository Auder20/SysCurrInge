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
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verificationCode" element={<VerificationCode />} />
              
              {/* Rutas públicas que no requieren autenticación */}
              
              {/* Rutas protegidas por rol */}
              <Route 
                path="/dashBoard" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <DashBoard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashBoard2" 
                element={
                  <ProtectedRoute allowedRoles={['coordinador']}>
                    <DashBoard2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/adminDashBoard" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/userManagement" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/taskManagement" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <TaskManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meetingScheduler" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <MeetingScheduler />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/coordinatorDashBoard" 
                element={
                  <ProtectedRoute allowedRoles={['coordinador']}>
                    <CoordinatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/memberDashBoard" 
                element={
                  <ProtectedRoute allowedRoles={['participante']}>
                    <MemberDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/guestDashBoard" 
                element={
                  <ProtectedRoute allowedRoles={['participante', 'invitado']}>
                    <GuestDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas protegidas adicionales */}
              <Route 
                path="/attendanceRegistration" 
                element={
                  <ProtectedRoute allowedRoles={['administrador', 'coordinador']}>
                    <AttendanceRegistration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/writeProcedings" 
                element={
                  <ProtectedRoute allowedRoles={['coordinador']}>
                    <WriteProcedings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meetingAgendas/:id_reunion?" 
                element={
                  <ProtectedRoute allowedRoles={['administrador', 'coordinador']}>
                    <MeetingAgendas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meetingManagement" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <MeetingManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editUser/:id" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <EditUser />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/addTaskForm" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <AddTaskForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editTask/:id" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <EditTask />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editMeeting/:id" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <EditMeeting />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/addMeetingForm" 
                element={
                  <ProtectedRoute allowedRoles={['administrador']}>
                    <AddMeetingForm />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </AdminProvider>
      </RegisterProvider>
    </AuthProvider>
  );
};

export default App;
