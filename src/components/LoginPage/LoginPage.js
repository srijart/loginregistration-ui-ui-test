import React, { useEffect, useState } from 'react';
import { FaGoogle, FaInstagram, FaTwitter, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css';
import { ToastContainer, toast } from 'react-toastify';
import { loginWithUserName } from '../../Services/courseService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';
import 'react-toastify/dist/ReactToastify.css'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginWithUserName(info);
      if (response.status === 200) {
        toast.success("Logged In successfully!", { autoClose: 3000 });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('fullName', response.data.fullname);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('userId', response.data.userId);
        login();
        navigate('/');
      }
    } catch (error) {
      console.error(error);  
      if (error.response) {
        if (error.response.data === "Invalid User Name or Password") {
          toast.error("Invalid Credentials");
        } else {
          toast.error("Invalid Credentials");        
        }
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='main-login-container'>
     
      <div className="login-container">
        <div className="login-form">
          <h2>Login Page</h2>
          <p>Welcome Back!</p>
          <form onSubmit={handleLogin}>
            
          <div className="password-input-container"><input
              
              type="text"
              placeholder="Email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value.toLowerCase() })}
            />
            </div>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={info.password}
                onChange={(e) => setInfo({ ...info, password: e.target.value })}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className='submit-button' disabled={loading}>
              {loading ? <ClipLoader color="#fff" loading={loading} size={30} /> : "Login"}
            </button>
          </form>
          <div className="login-options">
            <a href="/register">Register Now</a>
            <a href="/forgot-password">Forgot Password</a>
          </div>
          <div className="divider">
            <hr />
            <span>or</span>
            <hr />
          </div>
          <div className="social-icons">
            <FaGoogle className='icon' style={{ color: '#FF5733' }} />
            <FaTwitter className='icon' style={{ color: '#1DA1F2' }} />
            <FaFacebook className='icon' style={{ color: '#1877F2' }} />
            <FaInstagram className='icon' style={{ color: '#C13584' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
