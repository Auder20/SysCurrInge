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
              <Route path="/dashBoard" element={<DashBoard />} />
              <Route path="/dashBoard2" element={<DashBoard2 />} />
              <Route path="/adminDashBoard" element={<AdminDashboard />} />
              <Route path="/userManagement" element={<UserManagement />} />
              <Route path="/taskManagement" element={<TaskManagement />} />
              <Route path="/meetingScheduler" element={<MeetingScheduler />} />
              <Route path="/reports" element={<Reports />} />
              <Route
                path="/attendanceRegistration"
                element={<AttendanceRegistration />}
              />
              <Route
                path="/cordinatorDashBoard"
                element={<CoordinatorDashboard />}
              />
              <Route path="/writeProcedings" element={<WriteProcedings />} />
              <Route path="/meetingAgendas" element={<MeetingAgendas />} />
              <Route
                path="/meetingManagement"
                element={<MeetingManagement />}
              />
              <Route path="/memberDashBoard" element={<MemberDashboard />} />
              <Route path="/guestDashBoard" element={<GuestDashboard />} />
              <Route path="/verificationCode" element={<VerificationCode />} />
              <Route path="/editUser/:id" element={<EditUser />} />
              <Route path="/addTaskForm" element={<AddTaskForm />} />
              <Route path="/editTask/:id" element={<EditTask />} />
              <Route path="/addMeetingForm" element={<AddMeetingForm />} />
            </Routes>
          </Router>
        </AdminProvider>
      </RegisterProvider>
    </AuthProvider>
  );
};

export default App;
