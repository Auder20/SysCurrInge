// src/components/AdminDashboard/AdminDashboard.js
import React from "react";
import UserManagement from "./UserManagement";
import TaskManagement from "./TaskManagement";
import MeetingScheduler from "./MeetingScheduler";
import Reports from "./Reports";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminDashboard() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      <div className="row">
        {/* User Management que ocupa todo el ancho */}
        <section className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">User Management</h3>
              <UserManagement />
            </div>
          </div>
        </section>

        {/* Task Management debajo de User Management */}
        <section className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Task Management</h3>
              <TaskManagement />
            </div>
          </div>
        </section>

        {/* Meeting Scheduler que ahora ocupa todo el ancho */}
        <section className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Meeting Scheduler</h3>
              <MeetingScheduler />
            </div>
          </div>
        </section>

        {/* Reports debajo de Meeting Scheduler */}
        <section className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Reports</h3>
              <Reports />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
