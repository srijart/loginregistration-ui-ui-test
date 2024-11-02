import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';  
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../../Services/courseService';
import ClipLoader from 'react-spinners/ClipLoader'; // Importing the loader

const PersonalInfo = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: localStorage.getItem('fullName'),
    email: localStorage.getItem('email'),
    newEmail: null, 
  });
  
  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    newEmail: false,
  });

  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;  
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;  
    setFormData({
      ...formData,
      [name]: value.toLowerCase(),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file,
        imageUrl: imageUrl,
      });
    }
  };

  const handleEditClick = (field) => {
    setIsEditable({
      ...isEditable,
      [field]: !isEditable[field],
    });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      toast.error('Current email is invalid.');
      return;
    }

    if (!formData.newEmail) {
      toast.error('New email cannot be empty.');
      return;
    }

    if (!validateEmail(formData.newEmail)) {
      toast.error('New email is invalid.');
      return;
    }

    setLoading(true); // Set loading to true

    axios.put(`${BASE_URL}/profileUpdate`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        console.log(response);
        toast.success('Check your new email for verification. After verification, your profile will be updated!');
      })
    .catch(error => {
        console.error('Error details:', error);
        toast.error('Error updating profile: ' + (error.response?.data.message || 'An error occurred'));
    })
    .finally(() => {
        setLoading(false); 
    });
  };

  return (
    <div className="section-content">
      {/* <ToastContainer /> */}
      <form onSubmit={handleSubmit}>
        <div className='image-container'>
          <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' alt="Profile" width="100" />
          <label htmlFor="imageUpload">
            <FaPen style={{ cursor: 'pointer' }} color={'white'} />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="input-container-p">
          <input className='input-p'
            type="text"
            name="fullName"
            placeholder={t("FullName")}
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditable.name}
          />
          <FaPen className="input-pen" style={{ cursor: 'pointer' }} 
            onClick={() => handleEditClick('name')}
          />
        </div>

        <div className="input-container-p">
          <input className='input-p'
            type="email"
            name="email"
            placeholder={t("Email")}
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditable.email}
          />
          <FaPen className="input-pen" style={{ cursor: 'pointer' }} 
            onClick={() => handleEditClick('email')}
          />
        </div>

        <div className="input-container-p">
          <input className='input-p'
            type="email"
            name="newEmail"
            placeholder={t("NewEmail")}
            value={formData.newEmail}
            onChange={handleEmailChange}
            disabled={!isEditable.newEmail}
          /> 
          <FaPen className="input-pen" style={{ cursor: 'pointer' }} 
            onClick={() => handleEditClick('newEmail')}
          />
        </div>

        <button type="submit" className="save-btn"> {t("Save")} </button>

        {loading && (
          <div className="loading-overlay">
            <ClipLoader color="black" loading={loading} size={50} />
            <p>{t("Please wait, your profile is being updated.")}</p>
            </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfo;
