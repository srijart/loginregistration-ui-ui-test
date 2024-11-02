import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage/LoginPage.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaGoogle, FaInstagram, FaTwitter, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import { register } from '../../Services/courseService';
import ClipLoader from 'react-spinners/ClipLoader';  

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    password: '',
    email: '',
    fullName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);  
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); 

     if (!data.fullName.trim()) {
      toast.error('Full Name cannot be empty', { autoClose: 3000 });
      setLoading(false);
      return;
    }

    if (!emailRegex.test(data.email)) {
      toast.error('Invalid email format', { autoClose: 3000 });
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(data.password)) {
      toast.error('Invalid password', { autoClose: 3000 });
      setLoading(false);
      return;
    }

    try {
      toast.success('Registering your account, please wait...', { autoClose: 3000 });       

      const response = await register(data);
      if (response.status === 201) {
        toast.success("Registered successfully!", { autoClose: 3000 });
        navigate('/login');
      } else {
        toast.error('Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.data === "Username already exists") {
          toast.error("Email already exists");
        }
      } else if (error.request) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
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
          <h2>Create An Account</h2>
          <p>First step for learning</p>
          <form onSubmit={handleRegister}>
            <div className="password-input-container">
              <input
                type="text"
                placeholder="Full Name"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
              />
            </div> 
            <div className="password-input-container">
              <input
                type="text"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value.toLowerCase() })}
              />
            </div>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}  
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}  
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type="submit" className='submit-button' disabled={loading}>
              {loading ? <ClipLoader color="#fff" loading={loading} size={30} /> : "Register"}
            </button>
          </form>
          <div className="options">
            <a href="/login">Already have an account? Log In</a>
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

export default Register;
