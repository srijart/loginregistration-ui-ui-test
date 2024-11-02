import React from "react";
import Sidebar from "./Sidebar";
import UserForm from "./UserForm";
import "./UserDashboard.css";
import EnrolledCourses from './EnrolledCourses'

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <UserForm />
          <EnrolledCourses/>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
