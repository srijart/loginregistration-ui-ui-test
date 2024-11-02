import React, { useEffect, useState } from "react";
import "./UserForm.css";
import { profile, profileUpdate } from "../../Services/courseService";
import { toast, ToastContainer } from "react-toastify";

const UserForm = () => {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState({ fullName: '', email: '', newEmail: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profile(email);
        console.log(response.data)
        if (response.status === 200) {
          setUser({ 
            fullName: response.data.fullName || '', 
            email: response.data.email || '', 
            newEmail: '' 
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [email]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      console.log('User data being saved:', user);
      const response = await profileUpdate(user);
      if (response.status === 200) {
        console.log(user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      if (error.response?.data === "Email is already in use") {
        toast.warn("Email is already in use");
      } else {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <div className="user-form">
      <div className="profile-section">
        <img
          className="profile-picture"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <button className="edit-button" type="button">
          <i className="fa fa-pencil"></i>
        </button>
      </div>
      <form onSubmit={handleSave}>
        
        <div className="input-field">
          <input
            type="text"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            placeholder="Full Name"
          />
          <button className="edit-button" type="button">
            <i className="fa fa-pencil"></i>
          </button>
        </div>
        <div className="input-field">
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
          />
          <button className="edit-button" type="button">
            <i className="fa fa-pencil"></i>
          </button>
        </div>
        <div className="input-field">
          <input
            type="email"
            placeholder="Enter New Email"
            value={user.newEmail}
            onChange={(e) => setUser({ ...user, newEmail: e.target.value })}
          />
          <button className="edit-button" type="button">
            <i className="fa fa-pencil"></i>
          </button>
        </div>
        <button className="save-button" type="submit">Save</button>
      </form>
      <a href="/home" className="return-link">
        &lt; Return To Site
      </a>
    </div>
  );
};

export default UserForm;
