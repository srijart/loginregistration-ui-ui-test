import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { createCourse } from '../Services/courseService';

const CourseModal = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingCourse = location.state?.course || { name: '', description: '', price: '' };

  const [formData, setFormData] = useState(editingCourse);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createCourse(formData);
      if (response.status === 201) {
        toast.success('Course saved successfully!');
        navigate('/');
      } else {
        toast.error('Course saving failed!');
        setLoading(false);
      }
    } catch (error) {
      toast.error('An error occurred!');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-top">
          <h2>{title}</h2>
          <button type="button" onClick={() => navigate('/')} className="cm-cancel-button">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* <ToastContainer /> */}
          <div className="cm-form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Course Name"
              required
            />
          </div>
          <div className="cm-form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
          </div>
          <div className="cm-form-group">
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />
          </div>
          <button type="submit" className="cm-post-button">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
