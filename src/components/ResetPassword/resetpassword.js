import React, { useState } from 'react'
import '../LoginPage/LoginPage.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import image_hand from '../../assets/image_hand.png'
import image_logo from '../../assets/image_logo.png'
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from '../../Services/courseService';


const Resetpassword = () => {

  const [token, setToken] = useState();
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const handleOtpsend = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(newPassword)) {
      toast.error('Invalid password', { autoClose: 3000 });
      return;
    }
    try {
      const response = await resetPassword(token, newPassword);
      if (response.status === 200) {
        toast.success("New Password updated successfully");
        navigate("/login")
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response);
      } else {
        toast.error("Wrong OTP !!");
      }
    }

  }


  return (
    <div className='main-login-container'>
      <div className="login-container">

        <div className="login-form">
          <h2>Create a New Password</h2>
          <form onSubmit={handleOtpsend}>
            
            <div className="password-input-container"><input type="text" placeholder="OTP" value={token} onChange={(e) => setToken(e.target.value)} /></div>
            <div className="password-input-container"> <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <button type="submit" className='submit-button' >Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Resetpassword;
