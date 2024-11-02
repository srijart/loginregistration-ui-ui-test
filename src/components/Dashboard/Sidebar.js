import { Link } from "react-router-dom";
import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li className="active">Personal Information</li>
        <li>Account Security</li>
        <li><Link to="/enrolled-courses">Enrolled Courses</Link></li>
        <li>Completed Courses</li>
        <li>Wishlist</li>
        <li>Payment History</li>
      </ul>
    </div>
  );
};

export default Sidebar;
