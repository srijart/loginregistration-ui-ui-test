import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import '../LoginPage/LoginPage.css' 
import { useNavigate } from 'react-router-dom';
import { forgetPassword } from '../../Services/courseService';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const navigate = useNavigate()

  const handleEmailVerfication = async (e) => {
    e.preventDefault();
    try {
      const response = await forgetPassword(email);
      if (response.status === 200) {
        toast.success("Email verified and OTP send");
        navigate("/resetpassword")
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Email not found");
      } else {
        toast.error("Failed to send OTP ");
      }
    }
  };

  return ( 
    
      <div className="forgot-container">
        
      <div className="login-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleEmailVerfication}>      
            <div className="password-input-container">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
         <button type="submit" className='submit-button'>Send OTP</button>
      </form>
    </div>
  </div>
);
}

export default ForgotPassword;
